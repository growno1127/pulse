<?php

namespace Laravel\Pulse\Recorders;

use Carbon\CarbonImmutable;
use Illuminate\Config\Repository;
use Illuminate\Queue\Events\JobFailed;
use Illuminate\Queue\Events\JobProcessed;
use Illuminate\Queue\Events\JobProcessing;
use Illuminate\Queue\Events\JobQueued;
use Laravel\Pulse\Entries\Entry;
use Laravel\Pulse\Entries\JobFinished;
use Laravel\Pulse\Entries\JobStarted;
use Laravel\Pulse\Entries\Update;
use Laravel\Pulse\Pulse;

class Jobs
{
    public array $tables = ['pulse_jobs'];

    public array $events = [
        JobFailed::class,
        JobProcessed::class,
        JobProcessing::class,
        JobQueued::class,
    ];

    /**
     * Create a new handler instance.
     */
    public function __construct(
        protected Pulse $pulse,
        protected Repository $config,
    ) {
        //
    }

    public function record(JobFailed|JobProcessed|JobProcessing|JobQueued $event): Entry|Update
    {
        $now = new CarbonImmutable();

        return match (true) {
            $event instanceof JobQueued => new Entry($this->tables[0], [
                'date' => $now->toDateTimeString(),
                'job' => is_string($event->job)
                    ? $event->job
                    : $event->job::class,
                'job_id' => $event->id,
                'user_id' => $this->pulse->authenticatedUserIdResolver(),
            ]),

            $event instanceof JobProcessing => new JobStarted(
                (string) $event->job->getJobId(),
                $now->toDateTimeString('millisecond')
            ),

            // TODO respect slow limit configuration? I don't think we should
            // here, and instead we should have our "clear data" command do this
            // for us.
            $event instanceof JobProcessed,
            $event instanceof JobFailed => new JobFinished(
                (string) $event->job->getJobId(),
                $now->toDateTimeString('millisecond')
            ),
        };
    }
}
