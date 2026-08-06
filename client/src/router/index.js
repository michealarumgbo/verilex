import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import GuestPage from '@/views/GuestPage.vue'
import ChatPage from '@/views/ChatPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GuestPage,
    },
    {
      path: '/chats/agent/',
      name: 'chatpage',
      component: ChatPage,
    },
  ],
})

export default router
