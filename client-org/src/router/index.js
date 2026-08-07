import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import AgentLayout from '@/views/AgentLayout.vue'
import PendingChatsView from '@/views/PendingChatsView.vue'
import ActiveChatsView from '@/views/ActiveChatsView.vue'
import ProfilePageView from '@/views/ProfilePageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
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
  ],
})

export default router
