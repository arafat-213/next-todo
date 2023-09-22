import { useBoardStore } from '@/store/BoardStore'
import { TrashIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd'

type Props = {
    todo: Todo,
    index: number,
    id: TypedColumn,
    innerRef: (element: HTMLElement | null) => void
    draggableProps: DraggableProvidedDraggableProps
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined
}
function TodoCard({todo, index, id, innerRef, draggableProps, dragHandleProps}: Props) {
  const [deleteTodo] = useBoardStore ((state) => [state.deleteTodo])
  return (
    <div
    className='bg-white rounded-md my-2 drop-shadow-md space-y-2 group hover:bg-gray-100'
    {...draggableProps}
    {...dragHandleProps}
    ref= {innerRef}
    >
     <div className='flex justify-between items-center p-4'>
        <p>
        {todo.title}
        </p>
        <button onClick={() => deleteTodo(index, todo, id)} className='text-gray-300 hover:text-gray-400 opacity-0 group-hover:opacity-100'>
            <TrashIcon className='ml-5 h-6 w-6' />
        </button>
     </div>
    </div>
  )
}

export default TodoCard