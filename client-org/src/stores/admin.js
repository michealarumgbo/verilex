import { api } from '@/services/api_constructor'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from './user'

export const useAdminStore = defineStore('admin', () => {
  const { refreshToken } = useUserStore()
  const agents = ref(null)
  const guests = ref(null)
  const getGuests = async () => {
    try {
      const { data } = await api.get('/admin/guests')
      guests.value = data.guests
      return data
    } catch (error) {
      if (error?.response) {
        const { data } = error.response
        if (data?.status == 401) {
          await refreshToken()
          await getGuests()
        }

        return data
      }
      console.log(error)
      return error
    }
  }
  const getAgents = async () => {
    try {
      const { data } = await api.get('/admin/agents')

      agents.value = data.agents
      return data
    } catch (error) {
      if (error?.response) {
        const { data } = error.response
        if (data?.status == 401) {
          await refreshToken()
          await getGuests()
        }

        return data
      }
      console.log(error)
      return error
    }
  }
  // stooped here
  const createAgents = async (formData = {}) => {
    try {
      const { data } = await api.post('/admin/agents', formData)

      return data
    } catch (error) {
      if (error?.response) {
        const { data } = error.response
        if (data?.status == 401) {
          await refreshToken()
          await getGuests()
        }

        return data
      }
      console.log(error)
      return error
    }
  }

  return { getGuests, getAgents, guests, agents }
})
