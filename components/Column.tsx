import { PlusCircleIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import TodoCard from './TodoCard'

type Props = {
    id: TypedColumn,
    todos: Todo[],
    index:number
}

const idToColumnText: {
    [key in TypedColumn]: string
} = {
    "todo": "To Do",
    "inprogress": "In Progress",
    "done": "Done"
}
function Column({id, todos, index}: Props) {
  return (
    <div>
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <div {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                >
                    {/* Droppable todos in the column */}
                    <Droppable droppableId={index.toString()} type="card">
                        {(provided, snapshot) => (
                            <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`p-2 rounded-2xl shadow-sm ${
                                snapshot.isDraggingOver? 'bg-green-200': 'bg-white/50'
                            }`}>
                                <h2 className='flex justify-between font-bold font-xl p-2 items-center'>{idToColumnText[id]}
                                <span className='text-gray-500 bg-gray-200 px-2 py-1 rounded-full text-sm font-normal'>{todos.length}</span>
                                </h2>

                                <div className='px-1'>
                                    {todos.map((todo, index) => (
                                        <Draggable
                                            key={todo.$id}
                                            draggableId={todo.$id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <TodoCard
                                                todo = {todo}
                                                index = {index}
                                                id = {id}
                                                innerRef={provided.innerRef}
                                                draggableProps={provided.draggableProps}
                                                dragHandleProps={provided.dragHandleProps}
                                                />
                                            )}
                                        </Draggable>
                                    ))}

                                    {provided.placeholder}

                                    <div className='flex item-end justify-end p-2'>
                                        <button className='text-green-500 hover:text-green-600'> 
                                            <PlusCircleIcon className='h-10 w-10'/>
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