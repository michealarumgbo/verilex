<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { agentStore } from '../stores/agentStore'

const route = useRoute()
const router = useRouter()

const selectedId = computed(() => route.params.id || agentStore.activeChats[0]?.id || null)
const selectedChat = computed(() => agentStore.activeChats.find((c) => c.id === selectedId.value) || null)

const messageInput = ref('')
const threadRef = ref(null)

function selectChat(id) {
    router.push({ name: 'active-chat', params: { id } })
}

function scrollToBottom() {
    nextTick(() => {
        if (threadRef.value) threadRef.value.scrollTop = threadRef.value.scrollHeight
    })
}

watch(selectedChat, () => scrollToBottom(), { immediate: true })

const customerReplies = [
    "Okay, thank you — I'll wait for that.",
    'Got it, appreciate the quick update.',
    'That works for me. What documents do you need from me?',
    "Understood. Please let me know once it's filed.",
]

function timeNow() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function sendMessage() {
    const text = messageInput.value.trim()
    if (!text || !selectedChat.value) return
    selectedChat.value.messages.push({ id: Date.now(), from: 'agent', text, time: timeNow() })
    messageInput.value = ''
    scrollToBottom()

    setTimeout(() => {
        if (!selectedChat.value) return
        selectedChat.value.messages.push({
            id: Date.now() + 1,
            from: 'customer',
            text: customerReplies[Math.floor(Math.random() * customerReplies.length)],
            time: timeNow(),
        })
        scrollToBottom()
    }, 1400 + Math.random() * 900)
}
</script>

<template>
    <div class="flex-1 flex min-h-0">

        <!-- ============================= CHAT LIST ============================= -->
        <div class="w-[320px] flex-shrink-0 border-r border-[#D6D1C0] bg-[#EFEDE5] flex flex-col min-h-0">
            <div class="h-[78px] flex items-center px-6 border-b border-[#D6D1C0] flex-shrink-0">
                <div>
                    <div class="font-mono2 text-[10.5px] tracking-[0.14em] uppercase text-[#1E3B32] font-medium">IN
                        PROGRESS</div>
                    <h1 class="font-display font-semibold text-[18px] text-[#101E2B] leading-tight mt-0.5">Active Chats
                    </h1>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto">
                <button v-for="c in agentStore.activeChats" :key="c.id" type="button" @click="selectChat(c.id)"
                    class="w-full text-left px-6 py-4 border-b border-[#D6D1C0] transition-colors"
                    :class="selectedId === c.id ? 'bg-[#FBFAF6]' : 'hover:bg-[rgba(251,250,246,0.5)]'">
                    <div class="flex items-center justify-between gap-2 mb-1.5">
                        <span class="text-[14px] font-semibold text-[#101E2B] truncate">{{ c.name }}</span>
                        <span class="font-mono2 text-[10px] text-[#9A9587] flex-shrink-0">{{ c.requestedAt }}</span>
                    </div>
                    <span
                        class="font-mono2 text-[9.5px] tracking-wider text-[#9A9587] border border-[#D6D1C0] px-2 py-0.5 rounded-full inline-block mb-1.5">{{
                            c.topic }}</span>
                    <p class="text-[13px] text-[#6B6558] truncate">{{ c.messages[c.messages.length - 1]?.text }}</p>
                </button>

                <div v-if="!agentStore.activeChats.length" class="p-8 text-center text-[13.5px] text-[#9A9587]">
                    No active chats. Accept a pending request to start one.
                </div>
            </div>
        </div>

        <!-- ============================= THREAD ============================= -->
        <div v-if="selectedChat" class="flex-1 flex flex-col min-h-0">
            <!-- thread header -->
            <div class="h-[78px] flex items-center justify-between px-8 border-b border-[#D6D1C0] flex-shrink-0">
                <div>
                    <div class="text-[16px] font-semibold text-[#101E2B]">{{ selectedChat.name }}</div>
                    <div class="flex items-center gap-2 mt-0.5">
                        <span class="font-mono2 text-[11px] text-[#6B6558]">{{ selectedChat.topic }}</span>
                        <span class="text-[#D6D1C0]">·</span>
                        <span class="font-mono2 text-[11px] text-[#9A9587]">{{ selectedChat.contact }}</span>
                    </div>
                </div>
                <span class="flex items-center gap-1.5 flex-shrink-0">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#3E8E63]"></span>
                    <span class="font-mono2 text-[10.5px] text-[#6B6558]">Active</span>
                </span>
            </div>

            <!-- messages -->
            <div ref="threadRef" class="flex-1 overflow-y-auto px-8 py-6 bg-[#EFEDE5]">
                <div class="flex flex-col gap-5 max-w-[680px]">
                    <div v-for="m in selectedChat.messages" :key="m.id" class="flex"
                        :class="m.from === 'agent' ? 'justify-end' : 'justify-start'">
                        <div class="max-w-[75%]">
                            <div v-if="m.from === 'customer'"
                                class="text-[11.5px] font-mono2 text-[#6B6558] mb-1.5 ml-1">{{ selectedChat.name }}
                            </div>
                            <div class="px-4 py-3 text-[14.5px] leading-relaxed"
                                :class="m.from === 'agent' ? 'bg-[#101E2B] text-[#EFEDE5]' : 'bg-[#FBFAF6] border border-[#D6D1C0] text-[#1B1B18]'">
                                {{ m.text }}
                            </div>
                            <div class="text-[10.5px] font-mono2 text-[#9A9587] mt-1"
                                :class="m.from === 'agent' ? 'text-right mr-1' : 'ml-1'">{{ m.time }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- composer -->
            <div class="border-t border-[#D6D1C0] bg-[#FBFAF6] px-8 py-4 flex-shrink-0">
                <form @submit.prevent="sendMessage" class="flex items-end gap-3 max-w-[680px]">
                    <textarea v-model="messageInput" rows="1" placeholder="Type your reply…"
                        class="flex-1 border border-[#D6D1C0] bg-white px-4 py-3 text-[14.5px] resize-none focus:outline-none focus:border-[#A9834B]"
                        @keydown.enter.exact.prevent="sendMessage"></textarea>
                    <button type="submit" :disabled="!messageInput.trim()"
                        class="px-6 py-3 text-sm font-semibold transition-colors flex-shrink-0"
                        :class="!messageInput.trim() ? 'bg-[#D6D1C0] text-[#9A9587] cursor-not-allowed' : 'bg-[#101E2B] text-[#EFEDE5] hover:bg-[#A9834B]'">
                        Send
                    </button>
                </form>
            </div>
        </div>

        <!-- empty state -->
        <div v-else class="flex-1 flex items-center justify-center text-center px-8">
            <div>
                <div class="font-display text-[19px] text-[#101E2B] font-semibold mb-2">No chat selected</div>
                <p class="text-[14px] text-[#9A9587] max-w-[280px]">Accept a pending request to start an active chat.
                </p>
            </div>
        </div>
    </div>
</template>
