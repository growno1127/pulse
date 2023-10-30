<?php

namespace Laravel\Pulse\Recorders;

use Carbon\CarbonImmutable;
use Illuminate\Config\Repository;
use Illuminate\Queue\Events\JobFailed;
use Illuminate\Queue\Events\JobProcessed;
use Illuminate\Queue\Events\JobProcessing;
use Illuminate\Queue\Events\JobQueued;
use Illuminate\Queue\Events\JobReleasedAfterException;
use Laravel\Pulse\Entry;
use Laravel\Pulse\Pulse;
use Laravel\Pulse\Update;

/**
 * @internal
 */
class Jobs
{
    use Concerns\Ignores;
    use Concerns\Sampling;

    /**
     * The table to record to.
     */
    public string $table = 'pulse_jobs';

    /**
     * The time the last job started processing.
     */
    protected ?CarbonImmutable $lastJobStartedProcessingAt;

    /**
     * The events to listen for.
     *
     * @var list<class-string>
     */
    public array $listen = [
        JobReleasedAfterException::class,
        JobFailed::class,
        JobProcessed::class,
        JobProcessing::class,
        JobQueued::class,
    ];

    /**
     * Create a new recorder instance.
     */
    public function __construct(
        protected Pulse $pulse,
        protected Repository $config,
    ) {
        //
    }

    /**
     * Record the job.
     *
     * @return \Laravel\Pulse\Entry|\Laravel\Pulse\Update|list<\Laravel\Pulse\Entry|\Laravel\Pulse\Update>|null
     */
    public function record(JobReleasedAfterException|JobFailed|JobProcessed|JobProcessing|JobQueued $event): Entry|Update|array|null
    {
        if ($event->connectionName === 'sync') {
            return null;
        }

        $now = new CarbonImmutable();

        if ($event instanceof JobQueued) {
            if (
                ! $this->shouldSampleDeterministically($event->payload()['uuid'])
                    || $this->shouldIgnore(is_string($event->job) ? $event->job : $event->job::class)
            ) {
                return null;
            }

            return new Entry($this->table, [
                'date' => $now->toDateTimeString(),
                'queued_at' => $now->toDateTimeString(),
                'job' => match (true) {
                    is_string($event->job) => $event->job,
                    method_exists($event->job, 'displayName') => $event->job->displayName(),
                    default => $event->job::class,
                },
                'job_uuid' => $event->payload()['uuid'],
                'attempt' => 1,
                'connection' => $event->connectionName,
                'queue' => $event->job->queue ?? 'default',
                'user_id' => $this->pulse->authenticatedUserIdResolver(),
            ]);
        }

        if (! $this->shouldSampleDeterministically((string) $event->job->uuid()) ||
            $this->shouldIgnore($event->job->resolveName())) {
            return null;
        }

        if ($event instanceof JobProcessing) {
            $this->lastJobStartedProcessingAt = $now;

            // TODO: Allow this to be ingested immediately?

            return new Update(
                $this->table,
                ['job_uuid' => (string) $event->job->uuid(), 'attempt' => $event->job->attempts()],
                [
                    'date' => $this->lastJobStartedProcessingAt->toDateTimeString(),
                    'processing_at' => $this->lastJobStartedProcessingAt->toDateTimeString(),
                ],
            );
        }

        if ($event instanceof JobReleasedAfterException) {
            return tap([
                new Update(
                    $this->table,
                    ['job_uuid' => $event->job->uuid(), 'attempt' => $event->job->attempts()],
                    [
                        'date' => $now->toDateTimeString(),
                        'released_at' => $now->toDateTimeString(),
                        'duration' => $duration = $this->lastJobStartedProcessingAt->diffInMilliseconds($now), // @phpstan-ignore method.nonObject
                        'slow' => $duration >= $this->config->get('pulse.recorders.'.static::class.'.threshold'),
                    ],
                ),
                new Entry($this->table, [
                    'date' => $now->toDateTimeString(),
                    'queued_at' => $now->toDateTimeString(),
                    'job' => $event->job->resolveName(),
                    'job_uuid' => $event->job->uuid(),
                    'attempt' => $event->job->attempts() + 1,
                    'connection' => $event->job->getConnectionName(),
                    'queue' => $event->job->getQueue(),
                ]),
            ], fn () => $this->lastJobStartedProcessingAt = null);
        }

        if ($event instanceof JobProcessed) {
            return tap(new Update(
                $this->table,
                ['job_uuid' => (string) $event->job->uuid(), 'attempt' => $event->job->attempts()],
                [
                    'date' => $now->toDateTimeString(),
                    'processed_at' => $now->toDateTimeString(),
                    'duration' => $duration = $this->lastJobStartedProcessingAt->diffInMilliseconds($now), // @phpstan-ignore method.nonObject
                    'slow' => $duration >= $this->config->get('pulse.recorders.'.static::class.'.threshold'),
                ],
            ), fn () => $this->lastJobStartedProcessingAt = null);
        }

        if ($event instanceof JobFailed) {
            return tap(new Update(
                $this->table,
                ['job_uuid' => (string) $event->job->uuid(), 'attempt' => $event->job->attempts()],
                [
                    'date' => $now->toDateTimeString(),
                    'failed_at' => $now->toDateTimeString(),
                    'duration' => $duration = $this->lastJobStartedProcessingAt->diffInMilliseconds($now), // @phpstan-ignore method.nonObject
                    'slow' => $duration >= $this->config->get('pulse.recorders.'.static::class.'.threshold'),
                ],
            ), fn () => $this->lastJobStartedProcessingAt = null);
        }
    }
}
