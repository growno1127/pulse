<x-pulse::card :cols="$cols" :rows="$rows" :class="$class">
    <x-pulse::card-header
        name="Cache"
        title="Global Time: {{ number_format($allTime) }}ms; Global run at: {{ $allRunAt }}; Key Time: {{ number_format($keyTime) }}ms; Key run at: {{ $keyRunAt }};"
        details="past {{ $this->periodForHumans() }}"
    >
        <x-slot:icon>
            <x-pulse::icons.rocket-launch />
        </x-slot:icon>
        <x-slot:actions>
            @php
                $count = count($config['groups']);
                $message = sprintf(
                    "Keys may be normalized using groups.\n\nThere %s currently %d %s configured.",
                    $count === 1 ? 'is' : 'are',
                    $count,
                    Str::plural('group', $count)
                );
            @endphp
            <button title="{{ $message }}" @click="alert('{{ str_replace("\n", '\n', $message) }}')">
                <x-pulse::icons.information-circle class="w-5 h-5 stroke-gray-400 dark:stroke-gray-600" />
            </button>
        </x-slot:actions>
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
            :class="[loadingNewDataset ? 'opacity-25 animate-pulse' : '', 'space-y-6']"
        >
            @if ($allCacheInteractions->count === 0)
                <x-pulse::no-results />
            @else
                <div class="grid grid-cols-3 gap-3 text-center">
                    <div class="flex flex-col justify-center @sm:block">
                        <span class="text-xl uppercase font-bold text-gray-700 dark:text-gray-300 tabular-nums">
                            @if ($config['sample_rate'] < 1)
                                <span title="Sample rate: {{ $config['sample_rate'] }}, Raw value: {{ number_format($allCacheInteractions->hits) }}">~{{ number_format($allCacheInteractions->hits * (1 / $config['sample_rate'])) }}</span>
                            @else
                                {{ number_format($allCacheInteractions->hits) }}
                            @endif
                        </span>
                        <span class="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">
                            Hits
                        </span>
                    </div>
                    <div class="flex flex-col justify-center @sm:block">
                        <span class="text-xl uppercase font-bold text-gray-700 dark:text-gray-300 tabular-nums">
                            @if ($config['sample_rate'] < 1)
                                <span title="Sample rate: {{ $config['sample_rate'] }}, Raw value: {{ number_format($allCacheInteractions->count - $allCacheInteractions->hits) }}">~{{ number_format(($allCacheInteractions->count - $allCacheInteractions->hits) * (1 / $config['sample_rate'])) }}</span>
                            @else
                                {{ number_format($allCacheInteractions->count - $allCacheInteractions->hits) }}
                            @endif
                        </span>
                        <span class="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">
                            Misses
                        </span>
                    </div>
                    <div class="flex flex-col justify-center @sm:block">
                        <span class="text-xl uppercase font-bold text-gray-700 dark:text-gray-300 tabular-nums">
                            {{ $allCacheInteractions->count > 0 ? round(($allCacheInteractions->hits / $allCacheInteractions->count) * 100, 2).'%' : '-' }}
                        </span>
                        <span class="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">
                            Hit Rate
                        </span>
                    </div>
                </div>
                <div>
                    <x-pulse::table>
                        <colgroup>
                            <col width="100%" />
                            <col width="0%" />
                            <col width="0%" />
                            <col width="0%" />
                        </colgroup>
                        <x-pulse::thead>
                            <tr>
                                <x-pulse::th class="text-left">Key</x-pulse::th>
                                <x-pulse::th class="text-right">Hits</x-pulse::th>
                                <x-pulse::th class="text-right">Misses</x-pulse::th>
                                <x-pulse::th class="text-right whitespace-nowrap">Hit Rate</x-pulse::th>
                            </tr>
                        </x-pulse::thead>
                        <tbody>
                            @foreach ($cacheKeyInteractions->take(100) as $interaction)
                                <tr class="h-2 first:h-0"></tr>
                                <tr wire:key="{{ $interaction->key }}">
                                    <x-pulse::td class="max-w-[1px]">
                                        <code class="block text-xs text-gray-900 dark:text-gray-100 truncate" title="{{ $interaction->key }}">
                                            {{ $interaction->key }}
                                        </code>
                                    </x-pulse::td>
                                    <x-pulse::td class="text-right text-gray-700 dark:text-gray-300 font-bold text-sm tabular-nums">
                                        @if ($config['sample_rate'] < 1)
                                            <span title="Sample rate: {{ $config['sample_rate'] }}, Raw value: {{ number_format($interaction->hits) }}">~{{ number_format($interaction->hits * (1 / $config['sample_rate'])) }}</span>
                                        @else
                                            {{ number_format($interaction->hits) }}
                                        @endif
                                    </x-pulse::td>
                                    <x-pulse::td class="text-right text-gray-700 dark:text-gray-300 font-bold text-sm tabular-nums">
                                        @if ($config['sample_rate'] < 1)
                                            <span title="Sample rate: {{ $config['sample_rate'] }}, Raw value: {{ number_format($interaction->count - $interaction->hits) }}">~{{ number_format(($interaction->count - $interaction->hits) * (1 / $config['sample_rate'])) }}</span>
                                        @else
                                            {{ number_format($interaction->count - $interaction->hits) }}
                                        @endif
                                    </x-pulse::td>
                                    <x-pulse::td class="text-right text-gray-700 dark:text-gray-300 font-bold text-sm tabular-nums">
                                        {{ $interaction->count > 0 ? round(($interaction->hits / $interaction->count) * 100, 2).'%' : '-' }}
                                    </x-pulse::td>
                                </tr>
                            @endforeach
                        </tbody>
                    </x-pulse::table>

                    @if ($cacheKeyInteractions->count() > 100)
                        <div class="mt-2 text-xs text-gray-400 text-center">Limited to 100 entries</div>
                    @endif
                </div>
            @endif
        </div>
    </x-pulse::card-body>
</x-pulse::card>
