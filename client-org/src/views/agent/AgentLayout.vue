<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { agentStore, logout } from '../../stores/agentStore'

const route = useRoute()
const router = useRouter()

const navItems = computed(() => [
    { name: 'dashboard', label: 'Dashboard', to: { name: 'dashboard' }, icon: "fas fa-dashboard" },
    { name: 'pending', label: 'Pending Chats', to: { name: 'pending' }, count: agentStore.pendingChats.length, icon: "fas fa-clock" },
    { name: 'active', label: 'Active Chats', to: { name: 'active' }, count: agentStore.activeChats.length, icon: "fas fa-message" },
    { name: 'profile', label: 'Profile', to: { name: 'profile' }, icon: "fas fa-user" },
])

function isActive(item) {
    if (item.name === 'active') return route.name === 'active' || route.name === 'active-chat'
    return route.name === item.name
}

function handleLogout() {
    logout()
    router.push({ name: 'login' })
}
</script>

<template>
    <div class="h-screen flex bg-[#EFEDE5] font-body ">

        <!-- ============================= SIDEBAR ============================= -->
        <aside class="w-[240px] flex-shrink-0 bg-[#101E2B] text-[#EFEDE5] flex flex-col">
            <!-- brand -->
            <div class="h-[78px] flex items-center gap-2.5 px-6 border-b border-[rgba(239,237,229,0.12)] flex-shrink-0">
                <span
                    class="w-[30px] h-[30px] rounded-full border-[1.4px] border-[#A9834B] flex items-center justify-center text-[13px] font-bold text-[#A9834B] font-display flex-shrink-0">A</span>
                <div class="min-w-0">
                    <div class="font-display font-semibold text-[16px] leading-none truncate">AAOC</div>
                    <div class="font-mono2 text-[9.5px] tracking-[0.14em] text-[rgba(239,237,229,0.5)] mt-1 uppercase">
                        Agent Portal</div>
                </div>
            </div>

            <!-- agent identity -->
            <div class="px-5 py-5 border-b border-[rgba(239,237,229,0.12)] flex items-center gap-3 flex-shrink-0">
                <div
                    class="w-9 h-9 rounded-full bg-[#A9834B] text-[#101E2B] flex items-center justify-center font-display font-semibold text-[13px] flex-shrink-0">
                    {{ agentStore.agent.initials }}
                </div>
                <div class="min-w-0">
                    <div class="text-[13.5px] font-semibold truncate">{{ agentStore.agent.name }}</div>
                    <div class="flex items-center gap-1.5 mt-0.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#3E8E63] flex-shrink-0"></span>
                        <span class="font-mono2 text-[10px] text-[rgba(239,237,229,0.6)]">{{ agentStore.agent.status
                            }}</span>
                    </div>
                </div>
            </div>

            <!-- nav -->
            <nav class="flex-1 w-full px-3  py-5 flex flex-col gap-2 overflow-y-auto">
                <router-link v-for="item in navItems" :key="item.name" :to="item.to">
                    <div class=" flex px-3 py-3  items-center gap-3"
                        :class="isActive(item) ? 'bg-[rgba(169,131,75,0.14)] text-[#C9A467]' : 'text-[rgba(239,237,229,0.65)] hover:text-[#EFEDE5] hover:bg-[rgba(239,237,229,0.05)]'">
                        <p><i :class="item.icon"></i> {{ item.label }}</p>
                        <p v-if="item.count" class="font-mono2 text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                            :class="isActive(item) ? 'bg-[#A9834B] text-[#101E2B]' : 'bg-[rgba(239,237,229,0.1)] text-[rgba(239,237,229,0.7)]'">
                            {{ item.count }}
                        </p>
                    </div>
                </router-link>
            </nav>

            <!-- logout -->
            <div class="px-3 pb-5 pt-3 border-t border-[rgba(239,237,229,0.12)] flex-shrink-0">
                <button type="button" @click="handleLogout"
                    class="w-full flex items-center gap-3 px-3.5 py-3 text-[14px] font-medium text-[rgba(239,237,229,0.65)] hover:text-[#C9A467] hover:bg-[rgba(239,237,229,0.05)] transition-colors">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9 21H6a2 2 0 01-2-2V5a2 2 0 012-2h3M16 17l5-5-5-5M21 12H9" />
                    </svg>
                    Logout
                </button>
            </div>
        </aside>

        <!-- ============================= MAIN ============================= -->
        <div class="flex-1 min-w-0 flex flex-col overflow-y-auto">
            <router-view />
        </div>
    </div>
</template>
