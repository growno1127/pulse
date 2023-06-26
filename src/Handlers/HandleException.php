<?php

namespace Laravel\Pulse\Handlers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Pulse\Pulse;
use Throwable;

class HandleException
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
     * Handle an exception.
     */
    public function __invoke(Throwable $e): void
    {
        try {
            $this->recordException($e);
        } catch (Throwable) {
            // Do nothing.
        }
    }

    /**
     * Record the exception.
     */
    protected function recordException(Throwable $e)
    {
        if (! $this->pulse->shouldRecord) {
            return;
        }

        $this->pulse->record('pulse_exceptions', [
            'date' => now()->toDateTimeString(),
            'user_id' => Auth::id(),
            'class' => get_class($e),
            'location' => $this->getLocation($e),
        ]);
    }

    /**
     * Get the location for the given exception.
     */
    protected function getLocation(Throwable $e): string
    {
        // TODO: has issue when exception occurs in Blade/Livewire view.
        $firstNonVendorFrame = collect($e->getTrace())
            ->firstWhere(fn ($frame) => isset($frame['file']) && $this->isNonVendorFile($frame['file']));

        if ($this->isNonVendorFile($e->getFile()) || $firstNonVendorFrame === null) {
            return $this->formatLocation($e->getFile(), $e->getLine());
        }

        return $this->formatLocation($firstNonVendorFrame['file'], $firstNonVendorFrame['line']);
    }

    /**
     * Determine whether a file is in the vendor directory.
     */
    protected function isNonVendorFile(string $file): bool
    {
        return ! Str::startsWith($file, base_path('vendor'));
    }

    /**
     * Format a file and line number and strip the base base.
     */
    protected function formatLocation(string $file, int $line): string
    {
        return Str::replaceFirst(base_path(), '', $file).':'.$line;
    }
}
