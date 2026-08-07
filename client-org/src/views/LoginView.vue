<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login } from '../stores/agentStore'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

function handleSubmit() {
    error.value = ''
    if (!email.value.trim() || !password.value.trim()) {
        error.value = 'Enter your email and password to continue.'
        return
    }

    isLoading.value = true
    // simulate an auth request
    setTimeout(() => {
        login({ email: email.value.trim() })
        isLoading.value = false
        router.push({ name: 'dashboard' })
    }, 900)
}
</script>

<template>
    <div class="min-h-screen bg-[#EFEDE5] flex items-center justify-center px-5 py-12 font-body">
        <div class="w-full max-w-[400px]">
            <!-- brand -->
            <div class="flex flex-col items-center mb-8">
                <div
                    class="w-14 h-14 rounded-full border-[1.4px] border-[#A9834B] flex items-center justify-center mb-4 animate-seal-in">
                    <span class="font-display text-2xl font-semibold text-[#A9834B]">V</span>
                </div>
                <div class="font-mono2 text-[11px] tracking-[0.14em] uppercase text-[#1E3B32] font-medium mb-1.5">Agent
                    Portal</div>
                <h1 class="font-display font-semibold text-[26px] text-[#101E2B]">Sign in to Verilex</h1>
            </div>

            <!-- card -->
            <form @submit.prevent="handleSubmit"
                class="bg-[#FBFAF6] border border-[#D6D1C0] p-8 shadow-[0_1px_2px_rgba(16,30,43,0.06),0_8px_24px_rgba(16,30,43,0.06)]">
                <div class="mb-4">
                    <label for="email" class="block text-xs text-[#6B6558] mb-1.5 font-medium">Work email</label>
                    <input id="email" v-model="email" type="email" autocomplete="username" placeholder="you@verilex.ng"
                        class="w-full border border-[#D6D1C0] bg-white px-3.5 py-3 text-[14.5px] text-[#1B1B18] focus:outline-none focus:border-[#A9834B]">
                </div>
                <div class="mb-2">
                    <label for="password" class="block text-xs text-[#6B6558] mb-1.5 font-medium">Password</label>
                    <input id="password" v-model="password" type="password" autocomplete="current-password"
                        placeholder="••••••••"
                        class="w-full border border-[#D6D1C0] bg-white px-3.5 py-3 text-[14.5px] text-[#1B1B18] focus:outline-none focus:border-[#A9834B]">
                </div>

                <div class="flex justify-end mb-5">
                    <a href="#" class="text-[12.5px] text-[#6B6558] hover:text-[#A9834B] transition-colors">Forgot
                        password?</a>
                </div>

                <p v-if="error" class="text-[13px] text-[#B3413C] mb-4 font-medium">{{ error }}</p>

                <button type="submit" :disabled="isLoading"
                    class="w-full flex items-center justify-center gap-2.5 bg-[#101E2B] text-[#EFEDE5] px-6 py-3.5 text-sm font-semibold hover:bg-[#A9834B] transition-colors disabled:opacity-70 disabled:cursor-wait">
                    <svg v-if="isLoading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3">
                        </circle>
                        <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V2.5A9.5 9.5 0 002.5 12H4z">
                        </path>
                    </svg>
                    {{ isLoading ? 'Signing in…' : 'Sign In' }}
                </button>
            </form>

            <p class="text-center text-[12.5px] text-[#9A9587] font-mono2 mt-6">
                Verilex Chambers · Accredited CAC &amp; FIRS Filing Agents
            </p>
        </div>

    </div>
</template>