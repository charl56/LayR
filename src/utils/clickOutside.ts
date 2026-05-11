import { type DirectiveBinding } from 'vue'

export const vClickOutside = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const handleClickOutside = (event: MouseEvent) => {
      // Si le clic est en dehors de l'élément
      if (!el.contains(event.target as Node)) {
        binding.value(event)
      }
    }

    el.click = () => handleClickOutside
    document.addEventListener('click', handleClickOutside)
  },

  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el.click as EventListener)
  }
}