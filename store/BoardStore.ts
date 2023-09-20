import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn'
interface BoardState {
  board: Board
 getBoard: () => Promise<void>
}

export const useBoardStore = create<BoardState>()(
  devtools(
    persist(
      (set) => ({
        board: {
          columns: new Map<TypedColumn, Column>()
        },
        getBoard: async () => {
          const board = await getTodosGroupedByColumn()
          set({ board })
        }
      }),
      {
        name: 'board-storage'
      }
    )
  )
)
