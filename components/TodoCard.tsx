import { MinusCircleIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd'

type Props = {
    todo: Todo,
    index: number,
    id: string,
    innerRef: (element: HTMLElement | null) => void
    draggableProps: DraggableProvidedDraggableProps
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined
}
function TodoCard({todo, index, id, innerRef, draggableProps, dragHandleProps}: Props) {
  return (
    <div
    className='bg-white rounded-md my-2 drop-shadow-md space-y-2'
    {...draggableProps}
    {...dragHandleProps}
    ref= {innerRef}
    >
     <div className='flex justify-between items-center p-4'>
        <p>
        {todo.title}
        </p>
        <button className='text-red-500 hover:text-red-600'>
            <MinusCircleIcon className='ml-5 h-8 w-8' />
        </button>
     </div>
    </div>
  )
}

export default TodoCard