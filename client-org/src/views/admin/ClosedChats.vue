<script setup>
import { ref, computed } from 'vue'
import { adminStore } from '@/stores/adminStore'

const search = ref('')

const filteredChats = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return adminStore.closedChats
    return adminStore.closedChats.filter((c) =>
        `${c.clientName} ${c.agentName} ${c.topic}`.toLowerCase().includes(q)
    )
})
</script>

<template>
    <div class="flex-1 overflow-y-auto">
        <!-- top bar -->
        <div class="h-19.5 flex items-center px-8 border-b border-rule bg-paper/90 backdrop-blur-md sticky top-0 z-10">
            <div>
                <div class="font-mono2 text-[10.5px] tracking-[0.14em] uppercase text-emerald font-medium">HISTORY</div>
                <h1 class="font-display font-semibold text-[20px] text-ink leading-tight mt-0.5">Closed Chats</h1>
            </div>
        </div>

        <div class="p-8 max-w-240">
            <input v-model="search" type="text" placeholder="Search by client, agent, or topic…"
                class="w-full max-w-90 border border-rule bg-card px-4 py-3 text-[14px] mb-6 focus:outline-none focus:border-brass">

            <div class="border border-rule bg-card overflow-hidden">
                <table class="w-full text-left">
                    <thead>
                        <tr class="border-b border-rule bg-paper-2">
                            <th class="font-mono2 text-[10.5px] uppercase tracking-wider text-muted px-5 py-3">Client
                            </th>
                            <th class="font-mono2 text-[10.5px] uppercase tracking-wider text-muted px-5 py-3">Agent
                            </th>
                            <th class="font-mono2 text-[10.5px] uppercase tracking-wider text-muted px-5 py-3">Topic
                            </th>
                            <th class="font-mono2 text-[10.5px] uppercase tracking-wider text-muted px-5 py-3">Closed
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in filteredChats" :key="c.id"
                            class="border-b border-rule last:border-b-0 hover:bg-white transition-colors">
                            <td class="px-5 py-4 text-[14.5px] text-charcoal font-medium">{{ c.clientName }}</td>
                            <td class="px-5 py-4 text-[14.5px] text-charcoal font-medium">{{ c.agentName }}</td>
                            <td class="px-5 py-4">
                                <span
                                    class="font-mono2 text-[9.5px] tracking-wider text-muted-light border border-rule px-2 py-0.5 rounded-full">{{
                                        c.topic }}</span>
                            </td>
                            <td class="px-5 py-4 text-[12.5px] font-mono2 text-muted">{{ c.closedAt }}</td>
                        </tr>

                        <tr v-if="!filteredChats.length">
                            <td colspan="4" class="px-5 py-10 text-center text-[14px] text-muted-light">No closed chats
                                match "{{ search }}".</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
