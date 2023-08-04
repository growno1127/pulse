<?php

namespace Laravel\Pulse;

use Illuminate\Redis\Connections\Connection;
use Predis\Client as Predis;
use Redis as PhpRedis;
use RuntimeException;

/**
 * @mixin \Redis
 * @mixin \Predis\Client
 */
class Redis
{
    /**
     * Create a new Redis instance.
     *
     * @param  \PhpRedis|\Predis\Client|null  $client
     */
    public function __construct(protected ?Connection $connection = null, protected $client = null)
    {
        if (array_filter(func_get_args()) === []) {
            throw new RuntimeException('Must provider a connection or client.');
        }
    }

    /**
     * Add an entry to the stream.
     */
    public function xadd($key, $dictionary)
    {
        if ($this->isPhpRedis()) {
            return $this->client()->xAdd($key, '*', $dictionary);
        }

        return $this->client()->xAdd($key, $dictionary);
    }

    /**
     * Read a range of entries from the stream.
     */
    public function xrange($key, $start, $end, $count = null)
    {
        return $this->client()->xrange(...array_filter(func_get_args()));
    }

    /**
     * Trim the stream.
     */
    public function xtrim($key, $strategy, $threshold)
    {
        $prefix = config('database.redis.options.prefix');

        if ($this->isPhpRedis()) {
            // PHP Redis does not support the minid strategy.
            return $this->client()->rawCommand('XTRIM', $prefix.$key, $strategy, $threshold);
        }

        return $this->client()->xtrim($key, $strategy, $threshold);
    }

    /**
     * Run commands in a pipeline.
     */
    public function pipeline(callable $closure): array
    {
        // ensure we run against a connection...
        return $this->connection->pipeline(function ($redis) use ($closure) {
            $closure(new self(client: $redis));
        });
    }

    /**
     * Determine if the client is PhpRedis.
     */
    protected function isPhpRedis(): bool
    {
        return $this->client() instanceof PhpRedis;
    }

    /**
     * Determine if the client is Predis.
     */
    protected function isPredis(): bool
    {
        return $this->client() instanceof Predis;
    }

    /**
     * The connections client.
     */
    protected function client(): PhpRedis|Predis
    {
        return $this->connection?->client() ?? $this->client;
    }

    /**
     * Proxies method calls to the connection or client.
     */
    public function __call(string $method, array $parameters): mixed
    {
        return ($this->connection ?? $this->client)->{$method}(...$parameters);
    }
}
