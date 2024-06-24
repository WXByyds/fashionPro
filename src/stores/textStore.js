import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTextStore = defineStore('texts', () => {
  const text = ref('')
  const isSearch = ref(false)
  const isFlush = ref(0)

  return { text, isFlush, isSearch }
})
