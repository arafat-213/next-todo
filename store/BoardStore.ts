import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn'
import { databases } from '@/appwrite'
interface BoardState {
  board: Board
 getBoard: () => Promise<void>
 setBoard: (board: Board) => void,
 updateTodoInDB: (todo: Todo, columnId: TypedColumn) => Promise <void>,
 searchString: string,
 setSearchString: (searchString: string) => void,
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
        },
        setBoard: (board) => set({ board }),
        updateTodoInDB: async (todo, columnId) => {
          await databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            {
              title: todo.title,
              status: columnId
            }
          )
        },
        searchString: '',
        setSearchString: (searchString) => set({ searchString }),
      }),
      {
        name: 'board-storage'
      }
    )
  )
)
