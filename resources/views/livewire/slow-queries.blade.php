@php
use \Doctrine\SqlFormatter\HtmlHighlighter;
use \Doctrine\SqlFormatter\SqlFormatter;

$sqlFormatter = new SqlFormatter(new HtmlHighlighter([
    HtmlHighlighter::HIGHLIGHT_RESERVED => 'class="font-semibold"',
    HtmlHighlighter::HIGHLIGHT_QUOTE => 'class="text-purple-200"',
    HtmlHighlighter::HIGHLIGHT_BACKTICK_QUOTE => 'class="text-purple-200"',
    HtmlHighlighter::HIGHLIGHT_BOUNDARY => 'class="text-cyan-200"',
    HtmlHighlighter::HIGHLIGHT_NUMBER => 'class="text-orange-200"',
    HtmlHighlighter::HIGHLIGHT_WORD => 'class="text-orange-200"',
    HtmlHighlighter::HIGHLIGHT_VARIABLE => 'class="text-orange-200"',
    HtmlHighlighter::HIGHLIGHT_ERROR => 'class="text-red-200"',
    HtmlHighlighter::HIGHLIGHT_COMMENT => 'class="text-gray-400"',
], false));
@endphp
<x-pulse::card :cols="$cols" :rows="$rows" :class="$class">
    <x-pulse::card-header
        name="Slow Queries"
        title="Time: {{ number_format($time, 4) }}ms; Run at: {{ $runAt }};"
        details="{{ config('pulse.slow_query_threshold') }}ms threshold, past {{ $this->periodForHumans() }}"
    >
        <x-slot:icon>
            <x-pulse::icons.circle-stack />
        </x-slot:icon>
    </x-pulse::card-header>

    <x-pulse::card-body :expand="$expand" wire:poll.5s="">
        <div
            x-data="{
                loadingNewDataset: false,
                init() {
                    Livewire.on('period-changed', () => (this.loadingNewDataset = true))

                    Livewire.hook('commit', ({ component, succeed }) => {
                        if (component.name === $wire.__instance.name) {
                            succeed(() => this.loadingNewDataset = false)
                        }
                    })
                }
            }"
            class="min-h-full flex flex-col"
            :class="loadingNewDataset ? 'opacity-25 animate-pulse' : ''"
        >
            @if (count($slowQueries) === 0)
                <x-pulse::no-results class="flex-1" />
            @else
                <x-pulse::table>
                    <colgroup>
                        <col width="100%" />
                        <col width="0%" />
                        <col width="0%" />
                    </colgroup>
                    <x-pulse::thead>
                        <tr>
                            <x-pulse::th class="text-left">Query</x-pulse::th>
                            <x-pulse::th class="text-right">Count</x-pulse::th>
                            <x-pulse::th class="text-right">Slowest</x-pulse::th>
                        </tr>
                    </x-pulse::thead>
                    <tbody>
                        @foreach ($slowQueries as $query)
                            <tr class="h-2 first:h-0"></tr>
                            <tr wire:key="{{ md5($query->sql) }}">
                                <x-pulse::td class="!p-0 truncate max-w-[1px]">
                                    <div class="relative">
                                        <code class="bg-gray-700 dark:bg-gray-800 py-4 rounded-md text-gray-100 block text-xs whitespace-nowrap overflow-x-auto [scrollbar-color:theme(colors.gray.500)_transparent] [scrollbar-width:thin]">
                                            <span class="px-3">{!! $sqlFormatter->highlight($query->sql) !!}</span>
                                        </code>
                                        <div class="absolute top-0 right-0 bottom-0 rounded-r-md w-3 bg-gradient-to-r from-transparent to-gray-700 dark:to-gray-800 pointer-events-none"></div>
                                    </div>
                                </x-pulse::td>
                                <x-pulse::td class="text-right text-gray-700 dark:text-gray-300 text-sm tabular-nums">
                                    <strong>{{ number_format($query->count) }}</strong>
                                </x-pulse::td>
                                <x-pulse::td class="text-right text-gray-700 dark:text-gray-300 text-sm whitespace-nowrap tabular-nums">
                                    @if ($query->slowest === null)
                                        <strong>Unknown</strong>
                                    @else
                                        <strong>{{ number_format($query->slowest) ?: '<1' }}</strong> ms
                                    @endif
                                </x-pulse::td>
                            </tr>
                        @endforeach
                    </tbody>
                </x-pulse::table>
            @endif
        </div>
    </x-pulse::card-body>
</x-pulse::card>
