<?php

namespace Laravel\Pulse\Livewire;

use Carbon\CarbonImmutable;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\View;
use Laravel\Pulse\Livewire\Concerns\HasPeriod;
use Laravel\Pulse\Livewire\Concerns\ShouldNotReportUsage;
use Livewire\Attributes\Url;
use Livewire\Component;

class Usage extends Component
{
    use HasPeriod, ShouldNotReportUsage;

    /**
     * The type of usage to show.
     *
     * @var 'request_counts'|'slow_endpoint_counts'|'dispatched_job_counts'|null
     */
    public ?string $type = null;

    /**
     * The usage type.
     *
     * @var 'request_counts'|'slow_endpoint_counts'|'dispatched_job_counts'
     */
    #[Url]
    public string $usage = 'request_counts';

    /**
     * Render the component.
     */
    public function render(callable $query): Renderable
    {
        [$userRequestCounts, $time, $runAt] = $this->userRequestCounts($query);

        $this->dispatch('usage:'.($this->type ? "{$this->type}:" : '').'dataLoaded');

        return View::make('pulse::livewire.usage', [
            'time' => $time,
            'runAt' => $runAt,
            'userRequestCounts' => $userRequestCounts,
        ]);
    }

    /**
     * Render the placeholder.
     */
    public function placeholder(): Renderable
    {
        return View::make('pulse::components.placeholder', ['class' => 'col-span-3']);
    }

    /**
     * The user request counts.
     */
    protected function userRequestCounts(callable $query): array
    {
        return Cache::remember("laravel:pulse:usage:{$this->getType()}:{$this->period}", $this->periodCacheDuration(), function () use ($query) {
            $now = new CarbonImmutable;

            $start = hrtime(true);

            $userRequestCounts = $query($this->periodAsInterval(), $this->getType());

            $time = (int) ((hrtime(true) - $start) / 1000000);

            return [$userRequestCounts, $time, $now->toDateTimeString()];
        });
    }

    /**
     * Get the type of usage to display.
     *
     * @return 'request_counts'|'slow_endpoint_counts'|'dispatched_job_counts'
     */
    public function getType(): string
    {
        return $this->type ?? $this->usage;
    }
}
