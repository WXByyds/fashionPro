import { defineStore } from 'pinia'
import { ref } from 'vue'
import image01 from '@/assets/loginBackground.png'
import image02 from '@/assets/loginImage.png'

export const useImageStore = defineStore('images', () => {
  const images = ref([image01, image02])

  return { images }
})
