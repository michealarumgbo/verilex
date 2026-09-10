<script setup>
import { computed } from 'vue'
import { adminStore } from '@/stores/adminStore'

const activeAgents = computed(() => adminStore.agents.filter((a) => a.status === 'Active').length)

const stats = computed(() => [
    { label: 'Total agents', value: adminStore.agents.length, code: 'SYSTEM / 01' },
    { label: 'Active agents', value: activeAgents.value, code: 'SYSTEM / 02' },
    { label: 'Total clients', value: adminStore.clients.length, code: 'SYSTEM / 03' },
    { label: 'Chats closed', value: adminStore.closedChats.length, code: 'SYSTEM / 04' },
])

const recentClosedChats = computed(() => adminStore.closedChats.slice(0, 4))
const recentAgents = computed(() => adminStore.agents.slice(0, 4))
</script>

<template>
    <div class="flex-1 overflow-y-auto">
        <!-- top bar -->
        <div class="h-19.5 flex items-center px-8 border-b border-rule bg-paper/90 backdrop-blur-md sticky top-0 z-10">
            <div>
                <div class="font-mono2 text-[10.5px] tracking-[0.14em] uppercase text-emerald font-medium">OVERVIEW
                </div>
                <h1 class="font-display font-semibold text-[20px] text-ink leading-tight mt-0.5">System Dashboard</h1>
            </div>
        </div>

        <div class="p-8 max-w-270">
            <!-- stat cards -->
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule mb-12">
                <div v-for="s in stats" :key="s.code" class="bg-card p-6">
                    <div class="font-mono2 text-[10.5px] text-brass tracking-wide mb-4">{{ s.code }}</div>
                    <div class="font-display text-[28px] font-semibold text-ink leading-none">{{ s.value }}</div>
                    <div class="text-[13px] text-muted mt-2">{{ s.label }}</div>
                </div>
            </div>

            <!-- recent closed chats -->
            <div class="mb-12">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="font-display text-[19px] font-semibold text-ink">Recently closed chats</h2>
                    <router-link :to="{ name: 'closed-chats' }"
                        class="text-[13px] font-medium text-brass hover:text-ink transition-colors">View all
                        →</router-link>
                </div>

                <div class="flex flex-col gap-px bg-rule border border-rule">
                    <div v-for="c in recentClosedChats" :key="c.id"
                        class="bg-card p-5 flex items-center justify-between gap-4">
                        <div class="min-w-0">
                            <div class="flex items-center gap-2.5 mb-1">
                                <span
                                    class="font-mono2 text-[9.5px] tracking-wider text-muted-light border border-rule px-2 py-0.5 rounded-full shrink-0">{{
                                        c.topic }}</span>
                                <span class="font-mono2 text-[10.5px] text-muted-light shrink-0">{{ c.closedAt }}</span>
                            </div>
                            <div class="text-[14.5px] text-charcoal">
                                <span class="font-semibold">{{ c.clientName }}</span>
                                <span class="text-muted"> with </span>
                                <span class="font-semibold">{{ c.agentName }}</span>
                            </div>
                        </div>
                        <span class="flex items-center gap-1.5 shrink-0">
                            <span class="w-1.5 h-1.5 rounded-full bg-muted-light"></span>
                            <span class="font-mono2 text-[11px] text-muted">Closed</span>
                        </span>
                    </div>
                </div>
            </div>

            <!-- recent agents -->
            <div>
                <div class="flex items-center justify-between mb-4">
                    <h2 class="font-display text-[19px] font-semibold text-ink">Agents</h2>
                    <router-link :to="{ name: 'agents' }"
                        class="text-[13px] font-medium text-brass hover:text-ink transition-colors">View all
                        →</router-link>
                </div>

                <div class="flex flex-col gap-px bg-rule border border-rule">
                    <div v-for="a in recentAgents" :key="a.id"
                        class="bg-card p-5 flex items-center justify-between gap-4">
                        <div class="min-w-0">
                            <div class="text-[14.5px] font-semibold text-ink">{{ a.firstName }} {{ a.lastName }}</div>
                            <div class="text-[12.5px] font-mono2 text-muted-light truncate">{{ a.email }}</div>
                        </div>
                        <span
                            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono2 shrink-0"
                            :class="a.status === 'Active' ? 'bg-success/10 text-success' : 'bg-muted-light/20 text-muted'">
                            <span class="w-1.5 h-1.5 rounded-full"
                                :class="a.status === 'Active' ? 'bg-success' : 'bg-muted-light'"></span>
                            {{ a.status }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
