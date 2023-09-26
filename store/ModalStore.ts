import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface ModalState {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useModalStore = create<ModalState>()(
  devtools(
    persist(
      (set) => ({
        isOpen: false,
        openModal: () => set({ isOpen: true }),
        closeModal: () => set({ isOpen: false })
      }),
      { name: 'modal-storage' }
    )
  )
)
