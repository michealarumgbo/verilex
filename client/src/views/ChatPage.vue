<script setup>
import router from '@/router'
import { reactive, ref, nextTick, onUnmounted, onMounted } from 'vue'

const agentPool = ['Chidinma', 'Emeka', 'Blessing', 'Ifeoma']
const agentName = ref('')
const chatRequest = reactive({ topic: 'Company Registration', msg: '', name: 'Jogn Doe', contact: 'johndoe@gmail.com' })
const messages = ref([])
const messageInput = ref('')
const hasAgent = ref(false)
const chatScrollRef = ref(null)
let agentJoinTimer = null
let replyTimer = null

// fetch chat using cookie

function timeNow() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function scrollToBottom() {
    nextTick(() => {
        if (chatScrollRef.value) chatScrollRef.value.scrollTop = chatScrollRef.value.scrollHeight
    })
}

function pushMessage(from, text) {
    messages.value.push({ id: Date.now() + Math.random(), from, text, time: timeNow() })
    scrollToBottom()
}


const cannedReplies = [
    "Got it — give me a moment to check that.",
    "Thanks for confirming, I'll get this filed for you.",
    "Perfect, that's everything I need. I'll follow up by email shortly.",
    "Noted. Is there anything else you'd like to add before we proceed?",
]

// send message - socket activity
function sendMessage() {
    const text = messageInput.value.trim()
    if (!hasAgent.value || !text) return
    pushMessage('user', text)
    messageInput.value = ''
    replyTimer = setTimeout(() => {
        pushMessage('agent', cannedReplies[Math.floor(Math.random() * cannedReplies.length)])
    }, 1200 + Math.random() * 1000)
}


// close chat - socket activity
function closeChat() {
    clearTimeout(agentJoinTimer)
    clearTimeout(replyTimer)
    messages.value = []
    hasAgent.value = false
    agentName.value = ''
    messageInput.value = ''
    chatRequest.topic = ''
    chatRequest.msg = ''
    chatRequest.name = ''
    chatRequest.contact = ''

    router.push("/")
}



function startAgent() {
    const firstName = chatRequest.name.trim().split(' ')[0] || 'there'
    // enter the chat
    messages.value = []
    hasAgent.value = false
    agentName.value = ''
    scrollToBottom()

    // simulate an agent joining and picking up the request
    agentJoinTimer = setTimeout(() => {
        agentName.value = agentPool[Math.floor(Math.random() * agentPool.length)]
        hasAgent.value = true
        pushMessage('agent', `Hi ${firstName}, this is Agent ${agentName.value}. I've got your request about "${chatRequest.topic}" — how can I help?`)
    }, 2200)
}

onUnmounted(() => {
    clearTimeout(agentJoinTimer)
    clearTimeout(replyTimer)
})

onMounted(() => {
    startAgent()
})

</script>
<template>
    <div
        class="bg-[#EFEDE5] text-[#1B1B18] font-body antialiased selection:bg-[#A9834B] selection:text-white overflow-x-hidden min-h-screen">
        <div class="min-h-screen flex flex-col">

            <!-- chat top nav -->
            <header class="sticky top-0 z-50 bg-[#101E2B] text-[#EFEDE5] border-b border-[rgba(239,237,229,0.12)]">
                <div class="max-w-[860px] mx-auto px-5 sm:px-8 h-[70px] flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span
                            class="w-[30px] h-[30px] rounded-full border-[1.4px] border-[#A9834B] flex items-center justify-center text-[13px] font-bold text-[#A9834B] font-display flex-shrink-0">V</span>
                        <div>
                            <div class="font-display font-semibold text-[16px] leading-none">Verilex Live Chat</div>
                            <div
                                class="flex items-center gap-1.5 mt-1.5 font-mono2 text-[11px] text-[rgba(239,237,229,0.6)]">
                                <span class="relative w-1.5 h-1.5 rounded-full flex-shrink-0"
                                    :class="hasAgent ? 'bg-[#3E8E63]' : 'bg-[#C9A467]'">
                                    <span v-if="!hasAgent"
                                        class="absolute -inset-1 rounded-full border border-[#C9A467] animate-pulse-ring"></span>
                                </span>
                                {{ hasAgent ? `${agentName} · Online` : 'Connecting to an agent…' }}
                            </div>
                        </div>
                    </div>
                    <button type="button" @click="closeChat"
                        class="inline-flex items-center gap-2 border border-[rgba(239,237,229,0.25)] text-[#EFEDE5] px-4 py-2.5 text-[13px] font-semibold hover:border-[#A9834B] hover:text-[#C9A467] transition-colors flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
                        </svg>
                        <span class="hidden sm:inline">Close Chat</span>
                    </button>
                </div>
            </header>

            <!-- chat body -->
            <main ref="chatScrollRef" class="flex-1 overflow-y-auto bg-[#EFEDE5]">
                <div class="max-w-[860px] mx-auto px-5 sm:px-8 py-8">

                    <!-- centered request notification line -->
                    <div class="flex justify-center mb-8">
                        <div
                            class="inline-flex items-center gap-2.5 bg-[#E7E4D8] border border-[#D6D1C0] text-[#6B6558] font-mono2 text-[12px] px-5 py-2.5 rounded-full max-w-full">
                            <span class="w-1.5 h-1.5 rounded-full bg-[#A9834B] flex-shrink-0"></span>
                            <span class="truncate">
                                Requested — {{ chatRequest.topic }}<template v-if="chatRequest.msg"> · "{{
                                    chatRequest.msg }}"</template>
                            </span>
                        </div>
                    </div>

                    <!-- messages -->
                    <div class="flex flex-col gap-5">
                        <div v-for="m in messages" :key="m.id" class="flex"
                            :class="m.from === 'user' ? 'justify-end' : 'justify-start'">
                            <div class="max-w-[80%] sm:max-w-[65%]">
                                <div v-if="m.from === 'agent'"
                                    class="text-[11.5px] font-mono2 text-[#6B6558] mb-1.5 ml-1">{{ agentName }}
                                </div>
                                <div class="px-4 py-3 text-[14.5px] leading-relaxed" :class="m.from === 'user'
                                    ? 'bg-[#101E2B] text-[#EFEDE5]'
                                    : 'bg-[#FBFAF6] border border-[#D6D1C0] text-[#1B1B18]'">
                                    {{ m.text }}
                                </div>
                                <div class="text-[10.5px] font-mono2 text-[#9A9587] mt-1"
                                    :class="m.from === 'user' ? 'text-right mr-1' : 'ml-1'">{{ m.time }}</div>
                            </div>
                        </div>

                        <!-- waiting-for-agent indicator -->
                        <div v-if="!hasAgent" class="flex justify-start">
                            <div
                                class="inline-flex items-center gap-2.5 bg-[#FBFAF6] border border-[#D6D1C0] text-[#6B6558] font-mono2 text-[12.5px] px-4 py-3">
                                <span class="flex gap-1">
                                    <span class="w-1.5 h-1.5 rounded-full bg-[#A9834B] animate-bounce-dot"
                                        style="animation-delay:0ms"></span>
                                    <span class="w-1.5 h-1.5 rounded-full bg-[#A9834B] animate-bounce-dot"
                                        style="animation-delay:150ms"></span>
                                    <span class="w-1.5 h-1.5 rounded-full bg-[#A9834B] animate-bounce-dot"
                                        style="animation-delay:300ms"></span>
                                </span>
                                Waiting for an agent to join…
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <!-- input bar -->
            <div class="border-t border-[#D6D1C0] bg-[#FBFAF6]">
                <div class="max-w-[860px] mx-auto px-5 sm:px-8 py-4">
                    <form @submit.prevent="sendMessage" class="flex items-end gap-3">
                        <textarea v-model="messageInput" :disabled="!hasAgent" rows="1"
                            :placeholder="hasAgent ? 'Type your message…' : 'Waiting for an agent to join the chat…'"
                            class="flex-1 border border-[#D6D1C0] bg-white px-4 py-3 text-[14.5px] resize-none focus:outline-none focus:border-[#A9834B] disabled:bg-[#E7E4D8] disabled:text-[#9A9587] disabled:cursor-not-allowed"
                            @keydown.enter.exact.prevent="sendMessage"></textarea>
                        <button type="submit" :disabled="!hasAgent || !messageInput.trim()"
                            class="px-6 py-3 text-sm font-semibold transition-colors flex-shrink-0" :class="(!hasAgent || !messageInput.trim())
                                ? 'bg-[#D6D1C0] text-[#9A9587] cursor-not-allowed'
                                : 'bg-[#101E2B] text-[#EFEDE5] hover:bg-[#A9834B]'">
                            Send
                        </button>
                    </form>
                    <p v-if="!hasAgent" class="text-[11.5px] text-[#9A9587] font-mono2 mt-2">You'll be able to reply
                        once an agent
                        joins the chat.</p>
                </div>
            </div>

        </div>
    </div>
</template>