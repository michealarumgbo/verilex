<script setup>
import { reactive, ref } from 'vue'
import { agentStore } from '../../stores/agentStore'

const statusOptions = ['Online', 'Away', 'Offline']

const form = reactive({
    name: agentStore.agent.name,
    email: agentStore.agent.email,
    phone: agentStore.agent.phone,
    title: agentStore.agent.title,
    status: agentStore.agent.status,
})

const saved = ref(false)

function handleSave() {
    agentStore.agent.name = form.name
    agentStore.agent.email = form.email
    agentStore.agent.phone = form.phone
    agentStore.agent.title = form.title
    agentStore.agent.status = form.status
    saved.value = true
    setTimeout(() => (saved.value = false), 2200)
}

const statCards = [
    { label: 'Chats handled', value: '186' },
]
</script>

<template>
    <div class="flex-1 overflow-y-auto">
        <!-- top bar -->
        <div
            class="h-19.5 flex items-center px-8 border-b border-[#D6D1C0] bg-[#EFEDE5]/90 backdrop-blur-md sticky top-0 z-10">
            <div>
                <div class="font-mono2 text-[10.5px] tracking-[0.14em] uppercase text-[#1E3B32] font-medium">ACCOUNT
                </div>
                <h1 class="font-display font-semibold text-[20px] text-[#101E2B] leading-tight mt-0.5">Profile</h1>
            </div>
        </div>

        <div class="p-8 max-w-215 grid md:grid-cols-[1fr_260px] gap-8">
            <!-- profile form -->
            <form @submit.prevent="handleSave" class="bg-[#FBFAF6] border border-[#D6D1C0] p-7">
                <div class="flex items-center gap-4 mb-7">
                    <div
                        class="w-16 h-16 rounded-full bg-[#A9834B] text-[#101E2B] flex items-center justify-center font-display font-semibold text-xl shrink-0">
                        {{ agentStore.agent.initials }}
                    </div>
                    <div>
                        <div class="text-[16px] font-semibold text-[#101E2B]">{{ form.name }}</div>
                        <div class="text-[13px] text-[#6B6558]">{{ form.title }}</div>
                    </div>
                </div>

                <div class="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label for="pf-name" class="block text-xs text-[#6B6558] mb-1.5 font-medium">Full name</label>
                        <input id="pf-name" v-model="form.name" type="text"
                            class="w-full border border-[#D6D1C0] bg-white px-3.5 py-3 text-[14.5px] focus:outline-none focus:border-[#A9834B]">
                    </div>
                    <div>
                        <label for="pf-title" class="block text-xs text-[#6B6558] mb-1.5 font-medium">Title</label>
                        <input id="pf-title" v-model="form.title" type="text"
                            class="w-full border border-[#D6D1C0] bg-white px-3.5 py-3 text-[14.5px] focus:outline-none focus:border-[#A9834B]">
                    </div>
                </div>

                <div class="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label for="pf-email" class="block text-xs text-[#6B6558] mb-1.5 font-medium">Email</label>
                        <input id="pf-email" v-model="form.email" type="email"
                            class="w-full border border-[#D6D1C0] bg-white px-3.5 py-3 text-[14.5px] focus:outline-none focus:border-[#A9834B]">
                    </div>
                    <div>
                        <label for="pf-phone" class="block text-xs text-[#6B6558] mb-1.5 font-medium">Phone</label>
                        <input id="pf-phone" v-model="form.phone" type="text"
                            class="w-full border border-[#D6D1C0] bg-white px-3.5 py-3 text-[14.5px] focus:outline-none focus:border-[#A9834B]">
                    </div>
                </div>

                <div class="mb-6">
                    <label class="block text-xs text-[#6B6558] mb-2 font-medium">Status</label>
                    <div class="flex gap-2">
                        <button v-for="opt in statusOptions" :key="opt" type="button" @click="form.status = opt"
                            class="px-4 py-2 text-[13px] font-medium border transition-colors" :class="form.status === opt
                                ? 'bg-[#101E2B] text-[#EFEDE5] border-[#101E2B]'
                                : 'border-[#D6D1C0] text-[#6B6558] hover:border-[#A9834B] hover:text-[#A9834B]'">
                            {{ opt }}
                        </button>
                    </div>
                </div>

                <button type="submit"
                    class="inline-flex items-center gap-2 bg-[#101E2B] text-[#EFEDE5] px-6 py-3 text-sm font-semibold hover:bg-[#A9834B] transition-colors">
                    {{ saved ? 'Saved ✓' : 'Save Changes' }}
                </button>
            </form>

            <!-- stat cards -->
            <div class="flex flex-col gap-px bg-[#D6D1C0] border border-[#D6D1C0] h-fit">
                <div v-for="s in statCards" :key="s.code" class="bg-[#FBFAF6] p-5">
                    <div class="font-display text-[22px] font-semibold text-[#101E2B] leading-none">{{ s.value }}</div>
                    <div class="text-[12.5px] text-[#6B6558] mt-2">{{ s.label }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
