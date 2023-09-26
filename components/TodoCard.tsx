import { getUrl } from '@/lib/getUrl'
import { useBoardStore } from '@/store/BoardStore'
import { TrashIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps
} from 'react-beautiful-dnd'

type Props = {
  todo: Todo
  index: number
  id: TypedColumn
  innerRef: (element: HTMLElement | null) => void
  draggableProps: DraggableProvidedDraggableProps
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined
}
function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps
}: Props) {
  const [deleteTodo] = useBoardStore((state) => [state.deleteTodo])
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (todo.image) {
      setImageUrl(getUrl(todo.image))
    }
  }, [todo])
  return (
    <div
      className='group my-2 space-y-2 rounded-md bg-white drop-shadow-md hover:bg-gray-100'
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className='flex items-center justify-between p-4'>
        <p>{todo.title}</p>
        <button
          onClick={() => deleteTodo(index, todo, id)}
          className='text-gray-300 opacity-0 hover:text-gray-400 group-hover:opacity-100'
        >
          <TrashIcon className='ml-5 h-6 w-6' />
        </button>
      </div>
      {imageUrl && (
        <div className='relative h-full w-full rounded-b-md'>
          <Image
            src={imageUrl}
            alt={todo.title}
            className='w-full rounded-b-md object-contain'
            width={400}
            height={200}
          />
        </div>
      )}
    </div>
  )
}

export default TodoCard
