import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'users',
  () => {
    const token = ref('')
    const account = ref('')
    const type = ref('')
    const setToken = (t) => (token.value = t)

    return { token, setToken, account, type }
  },
  {
    persist: true
  }
)
