import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn'
import { databases, storage } from '@/appwrite'
interface BoardState {
  board: Board
 getBoard: () => Promise<void>
 setBoard: (board: Board) => void,
 updateTodoInDB: (todo: Todo, columnId: TypedColumn) => Promise <void>,
 searchString: string,
 setSearchString: (searchString: string) => void,
 deleteTodo: (taskIndex: number, todo: Todo, id: TypedColumn) => Promise<void>,
}

export const useBoardStore = create<BoardState>()(
  devtools(
    persist(
      (set, get) => ({
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
        deleteTodo: async (taskIndex, todo, id) => {
          if (todo.image)
            await storage.deleteFile(todo.image.bucketId, todo.image.fileId)
          await databases.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id
            )
            const newColumns = new Map(get().board.columns)

            // delete todoId from newColumns
            newColumns.get(id)?.todos.splice(taskIndex, 1)
            
            set({ board: { columns: newColumns } })
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
