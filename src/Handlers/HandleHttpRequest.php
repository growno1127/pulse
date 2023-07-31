<?php

namespace Laravel\Pulse\Handlers;

use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Laravel\Pulse\Entries\Entry;
use Laravel\Pulse\Facades\Pulse;
use Symfony\Component\HttpFoundation\Response;

class HandleHttpRequest
{
    /**
     * Handle the completion of an HTTP request.
     */
    public function __invoke(Carbon $startedAt, Request $request, Response $response): void
    {
        rescue(function () use ($startedAt, $request) {
            $now = new CarbonImmutable();

            Pulse::record(new Entry('pulse_requests', [
                'date' => $startedAt->toDateTimeString(),
                'user_id' => $request->user()?->id,
                'route' => $request->method().' '.Str::start(($request->route()?->uri() ?? $request->path()), '/'),
                'duration' => $startedAt->diffInMilliseconds(),
            ]));
        }, report: false);
    }
}
