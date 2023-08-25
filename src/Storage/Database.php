<?php

namespace Laravel\Pulse\Storage;

use Carbon\CarbonImmutable;
use Carbon\CarbonInterval as Interval;
use Illuminate\Config\Repository;
use Illuminate\Database\Connection;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Collection;
use Laravel\Pulse\Contracts\Storage;
use Laravel\Pulse\Entries\Entry;
use Laravel\Pulse\Entries\Update;

class Database implements Storage
{
    /**
     * Create a new Database storage instance.
     */
    public function __construct(
        protected DatabaseManager $manager,
        protected Repository $config,
    ) {
        //
    }

    /**
     * Store the entries and updates.
     *
     * @param  \Illuminate\Support\Collection<int, \Laravel\Pulse\Entries\Entry|\Laravel\Pulse\Entries\Update>  $items
     */
    public function store(Collection $items): void
    {
        if ($items->isEmpty()) {
            return;
        }

        [$inserts, $updates] = $items->partition(fn (Entry|Update $entry) => $entry instanceof Entry);

        $this->connection()->transaction(function () use ($inserts, $updates) {
            $inserts->groupBy('table')
                ->each(fn (Collection $rows, string $table) => $rows->chunk(1000)
                    ->map(fn (Collection $inserts) => $inserts->pluck('attributes')->all())
                    ->each($this->connection()->table($table)->insert(...)));

            $updates->each(fn (Update $update) => $update->perform($this->connection()));
        });
    }

    /**
     * Trim the stored entries.
     */
    public function trim(Collection $tables): void
    {
        $tables->each(fn (string $table) => $this->connection()
            ->table($table)
            ->where('date', '<', (new CarbonImmutable)->subSeconds((int) $this->trimAfter()->totalSeconds)->toDateTimeString())
            ->delete());
    }

    /**
     * The interval to trim the storage to.
     */
    protected function trimAfter(): Interval
    {
        return new Interval($this->config->get('pulse.retain') ?? 'P7D');
    }

    /**
     * Get the database connection.
     */
    protected function connection(): Connection
    {
        return $this->manager->connection(
            $this->config->get('pulse.storage.database.connection') ?? $this->config->get('database.default')
        );
    }
}
