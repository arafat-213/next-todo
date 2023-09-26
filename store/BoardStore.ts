import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn'
import { ID, databases, storage } from '@/appwrite'
import { uploadImage } from '@/lib/uploadImage'
interface BoardState {
  board: Board
  getBoard: () => Promise<void>
  setBoard: (board: Board) => void

  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => Promise<void>
  deleteTodo: (taskIndex: number, todo: Todo, id: TypedColumn) => Promise<void>
  addTodo: (
    todo: string,
    columnId: TypedColumn,
    image?: File | null
  ) => Promise<void>

  searchString: string
  setSearchString: (searchString: string) => void

  newTaskInput: string
  setNewTaskInput: (newTaskInput: string) => void

  newTaskType: TypedColumn
  setNewTaskType: (newTaskType: TypedColumn) => void

  image: File | null
  setImage: (image: File | null) => void
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
        addTodo: async (
          todo: string,
          columnId: TypedColumn,
          image?: File | null
        ) => {
          let file: Image | undefined
          if (image) {
            const uploadedFile = await uploadImage(image)
            if (uploadedFile) {
              file = {
                bucketId: uploadedFile.bucketId,
                fileId: uploadedFile.$id
              }
            }
          }
          const { $id } = await databases.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            ID.unique(),
            {
              title: todo,
              status: columnId,
              ...(file && { image: JSON.stringify(file) })
            }
          )

          set({ newTaskInput: '' })

          set((state) => {
            const newColumns = new Map(state.board.columns)

            const newTodo: Todo = {
              $id,
              $createdAt: new Date().toISOString(),
              title: todo,
              status: columnId,
              ...(file && { image: file })
            }

            const column = newColumns.get(columnId)
            if (!column) {
              newColumns.set(columnId, {
                id: columnId,
                todos: [newTodo]
              })
            } else {
              newColumns.get(columnId)?.todos.push(newTodo)
            }

            return { board: { columns: newColumns } }
          })
        },
        searchString: '',
        setSearchString: (searchString) => set({ searchString }),

        newTaskInput: '',
        setNewTaskInput: (newTaskInput) => set({ newTaskInput }),

        newTaskType: 'todo',
        setNewTaskType: (newTaskType) => set({ newTaskType }),

        image: null,
        setImage: (image: File | null) => set({ image })
      }),
      {
        name: 'board-storage'
      }
    )
  )
)
