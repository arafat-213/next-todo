import { PlusCircleIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import TodoCard from './TodoCard'
import { useBoardStore } from '@/store/BoardStore'

type Props = {
  id: TypedColumn
  todos: Todo[]
  index: number
}

const idToColumnText: {
  [key in TypedColumn]: string
} = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done'
}
function Column({ id, todos, index }: Props) {
  const [searchString] = useBoardStore((state) => [state.searchString])
  return (
    <div>
      <Draggable draggableId={id} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {/* Droppable todos in the column */}
            <Droppable droppableId={index.toString()} type='card'>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`rounded-2xl p-2 shadow-sm ${
                    snapshot.isDraggingOver ? 'bg-green-200' : 'bg-white/50'
                  }`}
                >
                  <h2 className='font-xl flex items-center justify-between p-2 font-bold'>
                    {idToColumnText[id]}
                    <span className='rounded-full bg-gray-200 px-2 py-1 text-sm font-normal text-gray-500'>
                      {!searchString
                        ? todos.length
                        : todos.filter(todo =>
                            todo.title
                              .toLowerCase()
                              .includes(searchString.toLowerCase())
                          ).length}
                    </span>
                  </h2>

                  <div className='px-1'>
                    {todos.map((todo, index) => {
                      if (
                        searchString &&
                        !todo.title
                          .toLocaleLowerCase()
                          .includes(searchString.toLocaleLowerCase())
                      )
                        return null
                      return (
                        <Draggable
                          key={todo.$id}
                          draggableId={todo.$id}
                          index={index}
                        >
                          {(provided) => (
                            <TodoCard
                              todo={todo}
                              index={index}
                              id={id}
                              innerRef={provided.innerRef}
                              draggableProps={provided.draggableProps}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          )}
                        </Draggable>
                      )
                    })}

                    {provided.placeholder}

                    <div className='item-end flex justify-end p-2'>
                      <button className='text-green-500 hover:text-green-600'>
                        <PlusCircleIcon className='h-10 w-10' />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        )}
      </Draggable>
    </div>
  )
}

export default Column
