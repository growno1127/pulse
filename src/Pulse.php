<?php

namespace Laravel\Pulse;

use Closure;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Lottery;
use Laravel\Pulse\Contracts\Ingest;
use Laravel\Pulse\Entries\Entry;
use Laravel\Pulse\Entries\Update;
use Throwable;

class Pulse
{
    use ListensForStorageOpportunities;

    /**
     * The list of queued entries to be stored.
     *
     * @var \Illuminate\Support\Collection<int, \Laravel\Pulse\Entries\Entry>
     */
    protected Collection $entriesQueue;

    /**
     * The list of queued entry updates.
     *
     * @var \Illuminate\Support\Collection<int, \Laravel\Pulse\Entries\Update>
     */
    protected Collection $updatesQueue;

    /**
     * Indicates if Pulse should record entries.
     */
    protected bool $shouldRecord = true;

    /**
     * The entry filters.
     *
     * @var \Illuminate\Support\Collection<int, (callable(\Laravel\Pulse\Entries\Entry|\Laravel\Pulse\Entries\Update): bool)>
     */
    protected Collection $filters;

    /**
     * Users resolver.
     *
     * @var (callable(\Illuminate\Support\Collection<int, string|int>): iterable<int, array{id: int|string, name: string, email?: string|null}>)|null
     */
    protected $usersResolver;

    /**
     * The callback that should be used to authenticate Pulse users.
     *
     * @var (callable(\Illuminate\Http\Request): bool)|null
     */
    protected $authUsing = null;

    /**
     * Indicates if Pulse migrations will be run.
     */
    protected bool $runsMigrations = true;

    /**
     * Handle exceptions using the given callback.
     *
     * @var (callable(\Throwable): mixed)|null
     */
    protected $handleExceptionsUsing = null;

    /**
     * Create a new Pulse instance.
     */
    public function __construct(protected Repository $config, protected Ingest $ingest)
    {
        $this->filters = collect([]);

        $this->clearQueue();
    }

    /**
     * Stop recording entries.
     */
    public function shouldNotRecord(): self
    {
        $this->shouldRecord = false;

        return $this;
    }

    /**
     * Filter incoming entries using the provided filter.
     *
     * @param  (callable(\Laravel\Pulse\Entries\Entry|\Laravel\Pulse\Entries\Update): bool)  $filter
     */
    public function filter(callable $filter): self
    {
        $this->filters[] = $filter;

        return $this;
    }

    /**
     * Record the given entry.
     */
    public function record(Entry $entry): self
    {
        if ($this->shouldRecord) {
            $this->entriesQueue[] = $entry;
        }

        return $this;
    }

    /**
     * Record the given entry update.
     */
    public function recordUpdate(Update $update): self
    {
        if ($this->shouldRecord) {
            $this->updatesQueue[] = $update;
        }

        return $this;
    }

    /**
     * Store the queued entries and flush the queue.
     */
    public function store(): self
    {
        if (! $this->shouldRecord) {
            return $this->clearQueue();
        }

        $this->rescue(fn () => $this->ingest->ingest(
            $this->entriesQueue->filter($this->shouldRecord(...)),
            $this->updatesQueue->filter($this->shouldRecord(...)),
        ));

        $this->rescue(fn () => Lottery::odds(...$this->config['ingest']['lottery'])
            ->winner(fn () => $this->ingest->trim())
            ->choose());

        return $this->clearQueue();
    }

    /**
     * Determine if the entry should be recorded.
     */
    protected function shouldRecord(Entry|Update $entry): bool
    {
        return $this->filters->every(fn ($filter) => $filter($entry));
    }

    /**
     * Resolve the user's details using the given closure.
     *
     * @param  (callable(\Illuminate\Support\Collection<int, string|int>): iterable<int, array{id: int|string, name: string, email?: string|null}>)  $callback
     */
    public function resolveUsersUsing(callable $callback): self
    {
        $this->usersResolver = $callback;

        return $this;
    }

    /**
     * Resolve the user's details using the given closure.
     *
     * @param  \Illuminate\Support\Collection<int, string|int>  $ids
     * @return  \Illuminate\Support\Collection<int, string|int>
     */
    public function resolveUsers(Collection $ids): Collection
    {
        if ($this->usersResolver) {
            return collect(($this->usersResolver)($ids));
        }

        if (class_exists(\App\Models\User::class)) {
            return \App\Models\User::whereKey($ids)->get(['id', 'name', 'email']);
        }

        if (class_exists(\App\User::class)) {
            return \App\User::whereKey($ids)->get(['id', 'name', 'email']);
        }

        return $ids->map(fn ($id) => [
            'id' => $id,
            'name' => "User ID: {$id}",
        ]);
    }

    /**
     * Return the compiled CSS from the vendor directory.
     */
    public function css(): string
    {
        return file_get_contents(__DIR__.'/../dist/pulse.css');
    }

    /**
     * Return the compiled JavaScript from the vendor directory.
     */
    public function js(): string
    {
        return file_get_contents(__DIR__.'/../dist/pulse.js');
    }

    /**
     * Determine if the given request can access the Pulse dashboard.
     */
    public function authorize(Request $request): bool
    {
        return ($this->authUsing ?: fn () => App::environment('local'))($request);
    }

    /**
     * Set the callback that should be used to authorize Pulse users.
     *
     * @param  (callable(\Illuminate\Http\Request): bool)  $callback
     */
    public function auth(callable $callback): self
    {
        $this->authUsing = $callback;

        return $this;
    }

    /**
     * Configure Pulse to not register its migrations.
     */
    public function ignoreMigrations(): self
    {
        $this->runsMigrations = false;

        return $this;
    }

    /**
     * Determine if Pulse may run migrations.
     */
    public function runsMigrations(): bool
    {
        return $this->runsMigrations;
    }

    /**
     * Handle exceptions using the given callback.
     *
     * @param  (callable(\Throwable): mixed)  $callback
     */
    public function handleExceptionsUsing(callable $callback): self
    {
        $this->handleExceptionsUsing = $callback;

        return $this;
    }

    /**
     * Execute the given callback handling any exceptions.
     *
     * @param  (callable(): mixed)  $callback
     */
    public function rescue(callable $callback): void
    {
        try {
            $callback();
        } catch (Throwable $e) {
            // TODO is this a good default?
            ($this->handleExceptionsUsing ?? fn () => null)($e);
        }
    }

    /**
     * Clear any pending entries on the queue.
     */
    protected function clearQueue(): self
    {
        $this->entriesQueue = collect([]);

        $this->updatesQueue = collect([]);

        return $this;
    }
}
