<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { agentStore, acceptChat } from '../stores/agentStore'

const router = useRouter()

const stats = computed(() => [
    { label: 'Pending requests', value: agentStore.pendingChats.length, code: 'QUEUE / 01' },
    { label: 'Active chats', value: agentStore.activeChats.length, code: 'QUEUE / 02' },
    { label: 'Resolved today', value: 7, code: 'QUEUE / 03' },
    { label: 'Chats handled', value: '186', code: 'QUEUE / 04' },
])

const recentPending = computed(() => agentStore.pendingChats.slice(0, 3))
const recentActive = computed(() => agentStore.activeChats.slice(0, 3))

function handleAccept(id) {
    acceptChat(id)
    router.push({ name: 'active' })
}
</script>

<template>
    <div class="flex-1 overflow-y-auto">
        <!-- top bar -->
        <div
            class="h-[78px] flex items-center px-8 border-b border-[#D6D1C0] bg-[#EFEDE5]/90 backdrop-blur-md sticky top-0 z-10">
            <div>
                <div class="font-mono2 text-[10.5px] tracking-[0.14em] uppercase text-[#1E3B32] font-medium">OVERVIEW
                </div>
                <h1 class="font-display font-semibold text-[20px] text-[#101E2B] leading-tight mt-0.5">
                    Welcome back, {{ agentStore.agent.name.split(' ')[0] || 'Agent' }}
                </h1>
            </div>
        </div>

        <div class="p-8 max-w-[1080px]">
            <!-- stat cards -->
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#D6D1C0] border border-[#D6D1C0] mb-12">
                <div v-for="s in stats" :key="s.code" class="bg-[#FBFAF6] p-6">
                    <div class="font-mono2 text-[10.5px] text-[#A9834B] tracking-wide mb-4">{{ s.code }}</div>
                    <div class="font-display text-[28px] font-semibold text-[#101E2B] leading-none">{{ s.value }}</div>
                    <div class="text-[13px] text-[#6B6558] mt-2">{{ s.label }}</div>
                </div>
            </div>

            <!-- pending preview -->
            <div class="mb-12">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="font-display text-[19px] font-semibold text-[#101E2B]">Recent pending requests</h2>
                    <router-link :to="{ name: 'pending' }"
                        class="text-[13px] font-medium text-[#A9834B] hover:text-[#101E2B] transition-colors">View all
                        →</router-link>
                </div>

                <div v-if="recentPending.length" class="flex flex-col gap-px bg-[#D6D1C0] border border-[#D6D1C0]">
                    <div v-for="c in recentPending" :key="c.id"
                        class="bg-[#FBFAF6] p-5 flex items-center justify-between gap-4">
                        <div class="min-w-0">
                            <div class="flex items-center gap-2.5 mb-1">
                                <span
                                    class="font-mono2 text-[9.5px] tracking-wider text-[#9A9587] border border-[#D6D1C0] px-2 py-0.5 rounded-full flex-shrink-0">{{
                                        c.topic }}</span>
                                <span class="font-mono2 text-[10.5px] text-[#9A9587] flex-shrink-0">{{ c.requestedAt
                                }}</span>
                            </div>
                            <div class="text-[14.5px] font-semibold text-[#101E2B]">{{ c.name }}</div>
                            <p class="text-[13.5px] text-[#6B6558] truncate mt-0.5">{{ c.message }}</p>
                        </div>
                        <button type="button" @click="handleAccept(c.id)"
                            class="flex-shrink-0 bg-[#101E2B] text-[#EFEDE5] px-4 py-2.5 text-[13px] font-semibold hover:bg-[#A9834B] transition-colors">
                            Accept
                        </button>
                    </div>
                </div>
                <div v-else class="bg-[#FBFAF6] border border-[#D6D1C0] p-8 text-center text-[14px] text-[#9A9587]">
                    No pending requests right now.
                </div>
            </div>

            <!-- active preview -->
            <div>
                <div class="flex items-center justify-between mb-4">
                    <h2 class="font-display text-[19px] font-semibold text-[#101E2B]">Your active chats</h2>
                    <router-link :to="{ name: 'active' }"
                        class="text-[13px] font-medium text-[#A9834B] hover:text-[#101E2B] transition-colors">View all
                        →</router-link>
                </div>

                <div v-if="recentActive.length" class="flex flex-col gap-px bg-[#D6D1C0] border border-[#D6D1C0]">
                    <router-link v-for="c in recentActive" :key="c.id"
                        :to="{ name: 'active-chat', params: { id: c.id } }"
                        class="bg-[#FBFAF6] hover:bg-white transition-colors p-5 flex items-center justify-between gap-4">
                        <div class="min-w-0">
                            <div class="flex items-center gap-2.5 mb-1">
                                <span
                                    class="font-mono2 text-[9.5px] tracking-wider text-[#9A9587] border border-[#D6D1C0] px-2 py-0.5 rounded-full flex-shrink-0">{{
                                        c.topic }}</span>
                                <span class="font-mono2 text-[10.5px] text-[#9A9587] flex-shrink-0">{{ c.requestedAt
                                }}</span>
                            </div>
                            <div class="text-[14.5px] font-semibold text-[#101E2B]">{{ c.name }}</div>
                            <p class="text-[13.5px] text-[#6B6558] truncate mt-0.5">{{ c.messages[c.messages.length -
                                1]?.text }}</p>
                        </div>
                        <span class="flex-shrink-0 flex items-center gap-1.5">
                            <span class="w-1.5 h-1.5 rounded-full bg-[#3E8E63]"></span>
                            <span class="font-mono2 text-[11px] text-[#6B6558]">Open →</span>
                        </span>
                    </router-link>
                </div>
                <div v-else class="bg-[#FBFAF6] border border-[#D6D1C0] p-8 text-center text-[14px] text-[#9A9587]">
                    No active chats yet — accept a pending request to start one.
                </div>
            </div>
        </div>
    </div>
</template>
