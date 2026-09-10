import { defineStore } from 'pinia'
import { api } from '@/services/api_constructor'

export const useChatStore = defineStore('chat', () => {
  const createChat = async (formData = {}) => {
    if (Object.keys(formData).length == 0) {
      throw new Error('Object must not be empty')
    }

    try {
      const { data } = await api.post('/chats/', formData)

      return data
    } catch (error) {
      if (error?.response) {
        const { data } = error.response
        return data
      }

      console.log(error)
      return { error }
    }
  }
  const getChat = async () => {
    try {
      const { data } = await api.get('/chats/session/', {
        withCredentials: true,
      })

      return data
    } catch (error) {
      if (error?.response) {
        const { data } = error.response
        return data
      }

      console.log(error)
      return { error }
    }
  }

  return {
    createChat,
    getChat,
  }
})
