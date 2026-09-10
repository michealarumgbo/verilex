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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },

    { path: '', redirect: { name: 'login' } },
    {
      path: '/agent',
      component: AgentLayout,
      // meta: { requiresAuth: true },
      children: [
        { path: '', redirect: { name: 'dashboard' } },
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
      // meta: { requiresAuth: true },
      children: [
        { path: '', redirect: { name: 'admin-dashboard' } },
        { path: 'dashboard', name: 'admin-dashboard', component: Dashboard },
        { path: 'clients', name: 'clients', component: ClientsPage },
        { path: 'agents', name: 'agents', component: AgentsPage },
        { path: 'chats/closed', name: 'closed-chats', component: ClosedChats },
        { path: 'create-agent', name: 'create-agent', component: CreateAgentPage },
      ],
    },
  ],
})

export default router
