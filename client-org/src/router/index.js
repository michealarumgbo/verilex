import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/agent/DashboardView.vue'
import AgentLayout from '@/views/agent/AgentLayout.vue'
import PendingChatsView from '@/views/agent/PendingChatsView.vue'
import ActiveChatsView from '@/views/agent/ActiveChatsView.vue'
import ProfilePageView from '@/views/agent/ProfilePageView.vue'
import AdminLayout from '@/views/admin/AdminLayout.vue'
import Dashboard from '@/views/admin/Dashboard.vue'
import ClientsPage from '@/views/admin/ClientsPage.vue'
import AgentsPage from '@/views/admin/AgentsPage.vue'
import ClosedChats from '@/views/admin/ClosedChats.vue'
import CreateAgentPage from '@/views/admin/CreateAgentPage.vue'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        guestOnly: true,
      },
    },

    { path: '', redirect: { name: 'login' } },
    {
      path: '/agent',
      component: AgentLayout,
      name: 'agent',
      meta: { requiresAuth: true, roles: ['agent'] },
      children: [
        { path: '', name: 'agent-default', redirect: { name: 'dashboard' } },
        { path: 'dashboard', name: 'dashboard', component: DashboardView },
        { path: 'pending', name: 'pending', component: PendingChatsView },
        { path: 'active', name: 'active', component: ActiveChatsView },
        { path: 'active/:id', name: 'active-chat', component: ActiveChatsView, props: true },
        { path: 'profile', name: 'profile', component: ProfilePageView },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      name: 'admin',
      meta: { requiresAuth: true, roles: ['admin'] },
      children: [
        { path: '', name: 'admin-default', redirect: { name: 'admin-dashboard' } },
        { path: 'dashboard', name: 'admin-dashboard', component: Dashboard },
        { path: 'clients', name: 'clients', component: ClientsPage },
        { path: 'agents', name: 'agents', component: AgentsPage },
        { path: 'chats/closed', name: 'closed-chats', component: ClosedChats },
        { path: 'create-agent', name: 'create-agent', component: CreateAgentPage },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useUserStore()

  if (!authStore.initialized) {
    await authStore.getMe()
  }
  const isAuthenticated = computed(() => !!authStore.user.role)

  // not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login' }
  }

  // already authenticated
  if (to.meta.guestOnly && isAuthenticated) {
    if (authStore.user.role === 'admin') {
      return { name: 'admin-dashboard' }
    }

    if (authStore.user.role === 'agent') {
      return { name: 'dashboard' }
    }
  }

  // wrong role
  if (to.meta.roles && !to.meta.roles.includes(authStore.user.role)) {
    if (authStore.user.role === 'admin') {
      return { name: 'admin-dashboard' }
    }

    if (authStore.user.role === 'agent') {
      return { name: 'dashboard' }
    }

    return { name: 'login' }
  }

  return true
})

export default router
