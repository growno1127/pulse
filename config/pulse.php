<?php

use Carbon\CarbonInterval as Interval;
use Laravel\Pulse\Http\Middleware\Authorize;

return [

    'enabled' => env('PULSE_ENABLED', true),

    'path' => env('PULSE_PATH', 'pulse'),

    'middleware' => [
        'web',
        Authorize::class,
    ],

    // The name that will appear in the dashboard after running the `pulse:check` command.
    // This must be unique for each reporting server.
    'server_name' => env('PULSE_SERVER_NAME', gethostname()),

    'storage' => [
        'driver' => env('PULSE_STORAGE_DRIVER', 'database'),

        'database' => [
            'connection' => env('PULSE_DB_CONNECTION') ?? env('DB_CONNECTION') ?? 'mysql',
        ],
    ],

    'ingest' => [
        'driver' => env('PULSE_INGEST_DRIVER', 'storage'),

        // TODO this might conflict with sampling lottery / whatevers
        'lottery' => [1, 1000],

        'redis' => [
            'connection' => env('PULSE_REDIS_CONNECTION') ?? 'default',
        ],
    ],

    // TODO how does this play with "storage" and the conflicting key above.
    'retain' => Interval::days(7),

    // TODO: filter configuration?

    // in milliseconds
    'slow_endpoint_threshold' => 0,

    // in milliseconds
    'slow_query_threshold' => 0,

    // in milliseconds
    'slow_job_threshold' => 0,

    // in milliseconds
    'slow_outgoing_request_threshold' => 0,

    // queues to show stats for
    'queues' => [
        'default',
    ],

    // directories to monitor sizes for
    'directories' => [
        '/',
    ],

    'checks' => [
        \Laravel\Pulse\Checks\QueueSize::class,
        \Laravel\Pulse\Checks\SystemStats::class,
    ],

    // cache keys to monitor
    // regex_pattern => name
    'cache_keys' => [
        '^post:139$' => 'Post 139',
        '^server:1\d{2}$' => 'Servers 100 - 199',
        '^flight:.*' => 'All flights',
    ],

    // Options: "avg", "max"
    'graph_aggregation' => 'avg',

];
