<?php

namespace Laravel\Pulse\Handlers;

use Carbon\CarbonImmutable;
use Illuminate\Queue\Events\JobProcessed;
use Laravel\Pulse\Pulse;
use Laravel\Pulse\Updates\RecordJobDuration;

class HandleProcessedJob
{
    /**
     * Create a handler instance.
     */
    public function __construct(
        protected Pulse $pulse,
    ) {
        //
    }

    /**
     * Handle the execution of a database query.
     */
    public function __invoke(JobProcessed $event): void
    {
        rescue(function () use ($event) {
            $now = new CarbonImmutable();

            // TODO respect slow limit configuration?

            $this->pulse->recordUpdate(new RecordJobDuration(
                (string) $event->job->getJobId(),
                $now->toDateTimeString('millisecond')
            ));
        }, report: false);
    }
}
