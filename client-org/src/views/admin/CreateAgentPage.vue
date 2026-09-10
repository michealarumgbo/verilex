<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { addAgent } from '@/stores/adminStore'

const router = useRouter()

const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
})

const tempPassword = ref('')
const isSaving = ref(false)
const error = ref('')

function generatePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let out = 'VLX-'
    for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)]
    tempPassword.value = out
}

onMounted(generatePassword)

function handleSubmit() {
    error.value = ''
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
        error.value = 'First name, last name, and email are all required.'
        return
    }

    isSaving.value = true
    setTimeout(() => {
        addAgent({
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
        })
        isSaving.value = false
        router.push({ name: 'agents' })
    }, 700)
}
</script>

<template>
    <div class="flex-1 overflow-y-auto">
        <!-- top bar -->
        <div
            class="h-19.5 flex items-center gap-4 px-8 border-b border-rule bg-paper/90 backdrop-blur-md sticky top-0 z-10">
            <router-link :to="{ name: 'agents' }" class="text-muted hover:text-brass transition-colors"
                aria-label="Back to agents">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 18l-6-6 6-6" />
                </svg>
            </router-link>
            <div>
                <div class="font-mono2 text-[10.5px] tracking-[0.14em] uppercase text-emerald font-medium">TEAM</div>
                <h1 class="font-display font-semibold text-[20px] text-ink leading-tight mt-0.5">Create Agent</h1>
            </div>
        </div>

        <div class="p-8 max-w-140">
            <form @submit.prevent="handleSubmit" class="bg-card border border-rule p-7">
                <div class="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label for="ca-first" class="block text-xs text-muted mb-1.5 font-medium">First name</label>
                        <input id="ca-first" v-model="form.firstName" type="text" placeholder="Chidinma"
                            class="w-full border border-rule bg-white px-3.5 py-3 text-[14.5px] focus:outline-none focus:border-brass">
                    </div>
                    <div>
                        <label for="ca-last" class="block text-xs text-muted mb-1.5 font-medium">Last name</label>
                        <input id="ca-last" v-model="form.lastName" type="text" placeholder="Okafor"
                            class="w-full border border-rule bg-white px-3.5 py-3 text-[14.5px] focus:outline-none focus:border-brass">
                    </div>
                </div>

                <div class="mb-4">
                    <label for="ca-email" class="block text-xs text-muted mb-1.5 font-medium">Work email</label>
                    <input id="ca-email" v-model="form.email" type="email" placeholder="chidinma.okafor@verilex.ng"
                        class="w-full border border-rule bg-white px-3.5 py-3 text-[14.5px] focus:outline-none focus:border-brass">
                </div>

                <div class="mb-6">
                    <label class="block text-xs text-muted mb-1.5 font-medium">Temporary password</label>
                    <div class="flex gap-2">
                        <input :value="tempPassword" readonly
                            class="flex-1 border border-rule bg-paper-2 px-3.5 py-3 text-[14.5px] font-mono2 text-charcoal focus:outline-none">
                        <button type="button" @click="generatePassword"
                            class="px-4 border border-rule text-muted hover:border-brass hover:text-brass transition-colors text-[13px] font-semibold">
                            Regenerate
                        </button>
                    </div>
                    <p class="text-[11.5px] text-muted-light mt-2">Shared with the agent on their first login — they'll
                        be asked to change it.</p>
                </div>

                <p v-if="error" class="text-[13px] text-danger mb-4 font-medium">{{ error }}</p>

                <div class="flex gap-3">
                    <button type="submit" :disabled="isSaving"
                        class="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3 text-sm font-semibold hover:bg-brass transition-colors disabled:opacity-70 disabled:cursor-wait">
                        <svg v-if="isSaving" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3">
                            </circle>
                            <path class="opacity-90" fill="currentColor"
                                d="M4 12a8 8 0 018-8V2.5A9.5 9.5 0 002.5 12H4z"></path>
                        </svg>
                        {{ isSaving ? 'Creating…' : 'Create Agent' }}
                    </button>
                    <router-link :to="{ name: 'agents' }"
                        class="inline-flex items-center px-6 py-3 text-sm font-semibold border border-rule text-muted hover:border-brass hover:text-brass transition-colors">
                        Cancel
                    </router-link>
                </div>
            </form>
        </div>
    </div>
</template>
