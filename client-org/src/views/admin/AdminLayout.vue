<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminStore } from '@/stores/adminStore'
import { useUserStore } from '@/stores/user'
import { useAdminStore } from '@/stores/admin'

const { getMe, logout } = useUserStore()
const { getAgents, getGuests, guests, agents } = useAdminStore()
const name = ref('')



onMounted(() => {
    const getAdminInfo = async () => {
        const data = await getMe()
        if (data?.error) {
            console.error(data.error)
            return
        }

        name.value = data.user.firstname + " " + data.user.lastname
        // console.log(data.user)

        const agentsData = await getAgents()
        if (agentsData?.error) {
            console.error(agentsData.error)
            return
        }
        // const guestsData = await getGuests()
        // if (guestsData?.error) {
        //     console.error(guestsData.error)
        //     return
        // }
        console.log(agents)
    }
    getAdminInfo()
})




const route = useRoute()
const router = useRouter()

const navItems = computed(() => [
    { name: 'admin-dashboard', label: 'Dashboard', to: { name: 'admin-dashboard' }, icon: "fas fa-dashboard" },
    { name: 'agents', label: 'Agents', to: { name: 'agents' }, count: adminStore.agents.length, icon: "fas fa-users" },
    { name: 'clients', label: 'Clients', to: { name: 'clients' }, count: adminStore.clients.length, icon: "fas fa-users" },
    { name: 'closed-chats', label: 'Closed Chats', to: { name: 'closed-chats' }, count: adminStore.closedChats.length, icon: "fas fa-message" },
])

function isActive(item) {
    if (item.name === 'agents') return route.name === 'agents' || route.name === 'create-agent'
    return route.name === item.name
}

async function handleLogout() {
    const data = await logout()
    if (data?.message) {
        router.push({ name: 'login' })
    }
    else {
        console.error(data?.error)
    }
}
</script>

<template>
    <div class="h-screen flex bg-paper font-body">

        <!-- ============================= SIDEBAR ============================= -->
        <aside class="w-60 shrink-0 bg-ink text-paper flex flex-col">
            <!-- brand -->
            <div class="h-19.5 flex items-center gap-2.5 px-6 border-b border-paper/12 shrink-0">
                <span
                    class="w-7.5 h-7.5 rounded-full border-[1.4px] border-brass flex items-center justify-center text-[13px] font-bold text-brass font-display shrink-0">A</span>
                <div class="min-w-0">
                    <div class="font-display font-semibold text-[16px] leading-none truncate">AAOC</div>
                    <div class="font-mono2 text-[9.5px] tracking-[0.14em] text-paper/50 mt-1 uppercase">Admin Console
                    </div>
                </div>
            </div>

            <!-- admin identity -->
            <div class="px-5 py-5 border-b border-paper/12 flex items-center gap-3 shrink-0">
                <div
                    class="w-9 h-9 rounded-full bg-brass text-ink flex items-center justify-center font-display font-semibold text-[13px] shrink-0">
                    A
                </div>
                <div class="min-w-0">
                    <div class="text-[13.5px] font-semibold truncate">{{ name }}</div>
                    <div class="flex items-center gap-1.5 mt-0.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-success shrink-0"></span>
                        <span class="font-mono2 text-[10px] text-paper/60">Monitoring</span>
                    </div>
                </div>
            </div>

            <!-- nav -->
            <nav class="flex-1 w-full px-3 py-5 flex flex-col gap-2 overflow-y-auto">
                <router-link v-for="item in navItems" :key="item.name" :to="item.to">
                    <div class=" flex px-3 py-3  items-center gap-3"
                        :class="isActive(item) ? 'bg-[rgba(169,131,75,0.14)] text-brass-light' : 'text-[rgba(239,237,229,0.65)] hover:text-paper hover:bg-[rgba(239,237,229,0.05)]'">
                        <p><i :class="item.icon"></i> {{ item.label }}</p>
                        <p v-if="item.count" class="font-mono2 text-[10px] px-2 py-0.5 rounded-full shrink-0"
                            :class="isActive(item) ? 'bg-brass text-ink' : 'bg-[rgba(239,237,229,0.1)] text-[rgba(239,237,229,0.7)]'">
                            {{ item.count }}
                        </p>
                    </div>
                </router-link>
            </nav>

            <!-- logout -->
            <div class="px-3 pb-5 pt-3 border-t border-paper/12 shrink-0">
                <button type="button" @click="handleLogout"
                    class="w-full flex items-center gap-3 px-3.5 py-3 text-[14px] font-medium text-paper/65 hover:text-brass-light hover:bg-paper/5 transition-colors">
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
