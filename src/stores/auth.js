import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem("authToken") || null,
    role: localStorage.getItem("user.role") || null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role === "admin"
  },
  actions: {
    login(token, role, username, user_id) {
      this.token = token
      this.role = role
      localStorage.setItem("authToken", token)
      localStorage.setItem("user.role", role)
      localStorage.setItem("user.username", username)
      localStorage.setItem("user.user_id", user_id)
    },
    logout() {
      this.token = null
      this.role = null
      localStorage.removeItem("authToken")
      localStorage.removeItem("user.role")
      localStorage.removeItem("user.username")
      localStorage.removeItem("user.user_id")
    }
  }
})
