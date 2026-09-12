import { defineStore } from 'pinia'
import { api } from '@/services/api_constructor'

export const useUserStore = defineStore('user', () => {
  const login = async (formData = {}) => {
    try {
      const { data } = await api.post('/auth/login', formData)

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

  const getMe = async () => {
    try {
      const { data } = await api.get('/auth/me')

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

  const logout = async () => {
    try {
      const { data } = await api.post('/auth/logout')

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

  return { login, getMe, logout }
})
