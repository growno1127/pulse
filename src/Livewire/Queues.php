<?php

namespace Laravel\Pulse\Livewire;

use Closure;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\View;
use Laravel\Pulse\Livewire\Concerns\ShouldNotReportUsage;
use Livewire\Component;

class Queues extends Component
{
    use ShouldNotReportUsage;

    /**
     * Render the component.
     */
    public function render(callable $query): Renderable
    {
        return View::make('pulse::livewire.queues', [
            'queues' => Cache::remember("illuminate:pulse:queues:live", 5, fn () => $query()),
        ]);
    }

    /**
     * Render the placeholder.
     */
    public function placeholder(): Renderable
    {
        return View::make('pulse::components.placeholder', ['class' => 'col-span-3']);
    }
}
