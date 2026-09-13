<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// import { login } from '../stores/agentStore'
import { useUserStore } from '@/stores/user'

const { login } = useUserStore()

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')
const errors = ref([])

async function handleSubmit() {
    errors.value = []
    setTimeout(() => {
        errors.value = []
    }, 5000)
    if (!email.value.trim()) {
        errors.value.push('Enter your email to continue.')
        return
    } else if (!password.value.trim()) {
        errors.value.push('Enter your password to continue.')
        return
    }

    const formData = {
        email: email.value,
        password: password.value
    }

    isLoading.value = true
    const data = await login(formData)
    // console.log(data)
    if (data?.error) {
        errors.value.push(data.error)
        isLoading.value = false
        return
    }

    if (data?.user.role == "admin") {
        return router.push({ path: '/admin/dashboard' })
    }
    if (data?.user.role == "agent") {
        return router.push({ path: '/agent/dashboard' })
    }


    isLoading.value = false
    // router.push({ path: '/admin/dashboard' })
}
</script>

<template>
    <div class="min-h-screen bg-paper flex items-center justify-center px-5 py-12 font-body">
        <div class="w-full max-w-100">
            <!-- brand -->
            <div class="flex flex-col items-center mb-8">
                <div
                    class="w-14 h-14 rounded-full border-[1.4px] border-brass flex items-center justify-center mb-4 animate-seal-in">
                    <span class="font-display text-2xl font-semibold text-brass">A</span>
                </div>
                <div class="font-mono2 text-[11px] tracking-[0.14em] uppercase text-emerald font-medium mb-1.5">Agent
                    Portal</div>
                <h1 class="font-display font-semibold text-[26px] text-ink">Sign in to AAOC</h1>
            </div>

            <!-- card -->
            <form @submit.prevent="handleSubmit"
                class="bg-card border border-rule p-8 shadow-[0_1px_2px_rgba(16,30,43,0.06),0_8px_24px_rgba(16,30,43,0.06)]">
                <div class="mb-4">
                    <label for="email" class="block text-xs text-muted mb-1.5 font-medium">Work email</label>
                    <input id="email" v-model="email" type="email" autocomplete="username" placeholder="Enter your work email"
                        class="w-full border border-rule bg-white px-3.5 py-3 text-[14.5px] text-charcoal focus:outline-none focus:border-brass">
                </div>
                <div class="mb-2">
                    <label for="password" class="block text-xs text-muted mb-1.5 font-medium">Password</label>
                    <input id="password" v-model="password" type="password" autocomplete="current-password"
                        placeholder="••••••••"
                        class="w-full border border-rule bg-white px-3.5 py-3 text-[14.5px] text-charcoal focus:outline-none focus:border-brass">
                </div>

                <div class="flex justify-end mb-5">
                    <a href="#" class="text-[12.5px] text-muted hover:text-brass transition-colors">Forgot
                        password?</a>
                </div>

                <p v-for="error in errors" class="text-[13px] text-danger mb-4 font-medium">{{ error }}</p>

                <button type="submit" :disabled="isLoading"
                    class="w-full flex items-center justify-center gap-2.5 bg-ink text-paper px-6 py-3.5 text-sm font-semibold hover:bg-brass transition-colors disabled:opacity-70 disabled:cursor-wait">
                    <svg v-if="isLoading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3">
                        </circle>
                        <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V2.5A9.5 9.5 0 002.5 12H4z">
                        </path>
                    </svg>
                    {{ isLoading ? 'Signing in…' : 'Sign In' }}
                </button>
            </form>

            <p class="text-center text-[12.5px] text-muted-light font-mono2 mt-6">
                ARUMGBO ARUMGBO & CO · LEGAL PRACTITIONERS, REALTOR & CONSULTANT
            </p>
        </div>

    </div>
</template>