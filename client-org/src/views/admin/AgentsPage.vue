<script setup>
import { ref, computed } from 'vue'
import { adminStore, toggleAgentStatus } from '@/stores/adminStore'

const search = ref('')

const filteredAgents = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return adminStore.agents
    return adminStore.agents.filter((a) =>
        `${a.firstName} ${a.lastName} ${a.email}`.toLowerCase().includes(q)
    )
})
</script>

<template>
    <div class="flex-1 overflow-y-auto">
        <!-- top bar -->
        <div
            class="h-19.5 flex items-center justify-between px-8 border-b border-rule bg-paper/90 backdrop-blur-md sticky top-0 z-10">
            <div>
                <div class="font-mono2 text-[10.5px] tracking-[0.14em] uppercase text-emerald font-medium">TEAM</div>
                <h1 class="font-display font-semibold text-[20px] text-ink leading-tight mt-0.5">Agents</h1>
            </div>
            <router-link :to="{ name: 'create-agent' }"
                class="inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 text-sm font-semibold hover:bg-brass transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" d="M12 5v14M5 12h14" />
                </svg>
                New Agent
            </router-link>
        </div>

        <div class="p-8 max-w-240">
            <input v-model="search" type="text" placeholder="Search agents by name or email…"
                class="w-full max-w-90 border border-rule bg-card px-4 py-3 text-[14px] mb-6 focus:outline-none focus:border-brass">

            <div class="border border-rule bg-card overflow-hidden">
                <table class="w-full text-left">
                    <thead>
                        <tr class="border-b border-rule bg-paper-2">
                            <th class="font-mono2 text-[10.5px] uppercase tracking-wider text-muted px-5 py-3">First
                                Name</th>
                            <th class="font-mono2 text-[10.5px] uppercase tracking-wider text-muted px-5 py-3">Last Name
                            </th>
                            <th class="font-mono2 text-[10.5px] uppercase tracking-wider text-muted px-5 py-3">Email
                            </th>
                            <th class="font-mono2 text-[10.5px] uppercase tracking-wider text-muted px-5 py-3">Status
                            </th>
                            <th
                                class="font-mono2 text-[10.5px] uppercase tracking-wider text-muted px-5 py-3 text-right">
                                Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="a in filteredAgents" :key="a.id"
                            class="border-b border-rule last:border-b-0 hover:bg-white transition-colors">
                            <td class="px-5 py-4 text-[14.5px] text-charcoal font-medium">{{ a.firstName }}</td>
                            <td class="px-5 py-4 text-[14.5px] text-charcoal font-medium">{{ a.lastName }}</td>
                            <td class="px-5 py-4 text-[13.5px] font-mono2 text-muted">{{ a.email }}</td>
                            <td class="px-5 py-4">
                                <span
                                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono2"
                                    :class="a.status === 'Active' ? 'bg-success/10 text-success' : 'bg-muted-light/20 text-muted'">
                                    <span class="w-1.5 h-1.5 rounded-full"
                                        :class="a.status === 'Active' ? 'bg-success' : 'bg-muted-light'"></span>
                                    {{ a.status }}
                                </span>
                            </td>
                            <td class="px-5 py-4 text-right">
                                <button type="button" @click="toggleAgentStatus(a.id)"
                                    class="px-4 py-2 text-[12.5px] font-semibold transition-colors" :class="a.status === 'Active'
                                        ? 'border border-rule text-muted hover:border-danger hover:text-danger'
                                        : 'bg-ink text-paper hover:bg-brass'">
                                    {{ a.status === 'Active' ? 'Deactivate' : 'Activate' }}
                                </button>
                            </td>
                        </tr>

                        <tr v-if="!filteredAgents.length">
                            <td colspan="5" class="px-5 py-10 text-center text-[14px] text-muted-light">No agents match
                                "{{ search }}".</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
