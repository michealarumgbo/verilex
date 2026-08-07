<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { agentStore, acceptChat } from '../stores/agentStore'

const router = useRouter()
const acceptingId = ref(null)

function handleAccept(id) {
    acceptingId.value = id
    // small delay so the accept feels deliberate, not instant
    setTimeout(() => {
        acceptChat(id)
        acceptingId.value = null
        router.push({ name: 'active' })
    }, 500)
}
</script>

<template>
    <div class="flex-1 overflow-y-auto">
        <!-- top bar -->
        <div
            class="h-[78px] flex items-center justify-between px-8 border-b border-[#D6D1C0] bg-[#EFEDE5]/90 backdrop-blur-md sticky top-0 z-10">
            <div>
                <div class="font-mono2 text-[10.5px] tracking-[0.14em] uppercase text-[#1E3B32] font-medium">QUEUE</div>
                <h1 class="font-display font-semibold text-[20px] text-[#101E2B] leading-tight mt-0.5">Pending Chats
                </h1>
            </div>
            <span class="font-mono2 text-[11.5px] text-[#6B6558] border border-[#D6D1C0] px-3 py-1.5 rounded-full">
                {{ agentStore.pendingChats.length }} waiting
            </span>
        </div>

        <div class="p-8 max-w-[860px]">
            <div v-if="agentStore.pendingChats.length" class="flex flex-col gap-4">
                <div v-for="c in agentStore.pendingChats" :key="c.id" class="bg-[#FBFAF6] border border-[#D6D1C0] p-6">
                    <div class="flex items-start justify-between gap-4 mb-4">
                        <div class="flex items-center gap-2.5">
                            <span
                                class="font-mono2 text-[9.5px] tracking-wider text-[#9A9587] border border-[#D6D1C0] px-2.5 py-1 rounded-full">{{
                                    c.topic }}</span>
                            <span class="font-mono2 text-[10.5px] text-[#9A9587]">Requested {{ c.requestedAt }}</span>
                        </div>
                        <span class="flex items-center gap-1.5 flex-shrink-0">
                            <span class="w-1.5 h-1.5 rounded-full bg-[#C9A467]"></span>
                            <span class="font-mono2 text-[10.5px] text-[#6B6558]">Waiting</span>
                        </span>
                    </div>

                    <div class="text-[16px] font-semibold text-[#101E2B] mb-1">{{ c.name }}</div>
                    <div class="text-[12.5px] font-mono2 text-[#9A9587] mb-3">{{ c.contact }}</div>
                    <p class="text-[14.5px] text-[#6B6558] leading-relaxed mb-5">{{ c.message }}</p>

                    <button type="button" :disabled="acceptingId === c.id" @click="handleAccept(c.id)"
                        class="inline-flex items-center gap-2 bg-[#101E2B] text-[#EFEDE5] px-5 py-3 text-sm font-semibold hover:bg-[#A9834B] transition-colors disabled:opacity-70 disabled:cursor-wait">
                        <svg v-if="acceptingId === c.id" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3">
                            </circle>
                            <path class="opacity-90" fill="currentColor"
                                d="M4 12a8 8 0 018-8V2.5A9.5 9.5 0 002.5 12H4z"></path>
                        </svg>
                        {{ acceptingId === c.id ? 'Accepting…' : 'Accept Chat' }}
                    </button>
                </div>
            </div>

            <div v-else class="bg-[#FBFAF6] border border-[#D6D1C0] p-12 text-center">
                <div class="font-display text-[19px] text-[#101E2B] font-semibold mb-2">Queue is clear</div>
                <p class="text-[14px] text-[#9A9587]">No pending chat requests right now. New requests will appear here.
                </p>
            </div>
        </div>
    </div>
</template>
