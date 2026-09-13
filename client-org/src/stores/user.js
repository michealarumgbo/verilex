import { defineStore } from 'pinia'
import { api } from '@/services/api_constructor'
import { ref, computed } from 'vue'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const user = ref({ role: null })
  const initialized = ref(false)

  const login = async (formData = {}) => {
    try {
      const { data } = await api.post('/auth/login', formData)

      user.value.role = data.user.role

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

      user.value.role = data.user.role

      return data
    } catch (error) {
      user.value = {
        role: null,
      }
      if (error?.response) {
        const { data } = error.response
        if (data?.status == 401) {
          await refreshToken()
          await getMe()
        }
        return data
      }

      console.log(error)
      return { error }
    } finally {
      initialized.value = true
    }
  }

  const logout = async () => {
    try {
      const { data } = await api.post('/auth/logout')

      user.value.role = null

      return data
    } catch (error) {
      if (error?.response) {
        const { data } = error.response
        if (data?.status == 401) {
          await refreshToken()
          await logout()
        }
        return data
      }

      console.log(error)
      return { error }
    }
  }

  const refreshToken = async () => {
    try {
      const { data } = await api.post('/auth/token/refresh')

      return data
    } catch (error) {
      if (error?.response) {
        const { data } = error.response
        user.value.role = null
        router.push({ name: 'login' })
        console.log(data)
        return
      }

      console.error(error)
      return { error }
    }
  }

  return { login, getMe, logout, user, initialized }
})
