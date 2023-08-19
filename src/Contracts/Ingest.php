<?php

namespace Laravel\Pulse\Contracts;

use Illuminate\Support\Collection;

interface Ingest
{
    /**
     * Ingest the entries and updates.
     *
     * @param  \Illuminate\Support\Collection<int, \Laravel\Pulse\Entries\Entry|\Laravel\Pulse\Entries\Update>  $items
     */
    public function ingest(Collection $items): void;

    /**
     * Trim the ingested entries.
     */
    public function trim(): void;

    /**
     * Store the ingested entries.
     */
    public function store(Storage $storage, int $count): int;
}
