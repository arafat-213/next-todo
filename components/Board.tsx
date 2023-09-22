'use client'
import { useEffect } from 'react'
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd'

import { useBoardStore } from '@/store/BoardStore'
import Column from './Column'

function Board() {
  const [board, getBoard, setBoard, updateTodoInDB ] = useBoardStore((state) => [
    state.board,
    state.getBoard,
    state.setBoard,
    state.updateTodoInDB
  ])
  useEffect(() => {
    getBoard()
  }, [getBoard])

  const handleOnDragEnd = (result: DropResult) => {
    const { source, destination, type } = result

    // dropped outside the list
    if (!destination) {
      return
    }

    // handle column drag
    if (type === 'column') {
      const items = Array.from(board.columns.entries())
      const [removed] = items.splice(source.index, 1)
      items.splice(destination.index, 0, removed)
      setBoard({
        ...board,
        columns: new Map(items!)
      })
    }

    // handle card drag
    const columns = Array.from(board.columns)
    const startColIndex = columns[Number(source.droppableId)]
    const endColIndex = columns[Number(destination.droppableId)]

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos
    }

    const endCol: Column = {
      id: endColIndex[0],
      todos: endColIndex[1].todos
    }

    if (!startCol || !endCol) return

    if (source.index === destination.index && startCol === endCol) return

    const newStartTodos = startCol.todos
    const [todoMoved] = newStartTodos.splice(source.index, 1)

    if (startCol.id === endCol.id) {
      // Moving the order of toods in the same column
      newStartTodos.splice(destination.index, 0, todoMoved)
      const newStartCol = {
        id: startCol.id,
        todos: newStartTodos
      }
      const newColumnsMap = new Map(board.columns)
      newColumnsMap.set(startCol.id, newStartCol)

      setBoard({
        ...board,
        columns: newColumnsMap
      })
    } else {
      // Moving the todo from one column to another
      const newEndTodos = Array.from(endCol.todos)
      newEndTodos.splice(destination.index, 0, todoMoved)

      const newStartCol = {
        id: startCol.id,
        todos: newStartTodos
      }

      const newEndCol = {
        id: endCol.id,
        todos: newEndTodos
      }

      const newColumnsMap = new Map(board.columns)
      // newColumnsMap.set(startCol.id, newStartCol)
      newColumnsMap.set(startCol.id, newStartCol)
      newColumnsMap.set(endCol.id, newEndCol)

      updateTodoInDB(todoMoved, endCol.id)
      
      setBoard({
        ...board,
        columns: newColumnsMap
      })
    }
  }
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId='board' direction='horizontal' type='column'>
        {(provided) => (
          <div
            className='mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-3'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {board?.columns?.entries &&
              Array.from(board.columns.entries()).map(([id, column], index) => (
                <Column key={id} id={id} todos={column.todos} index={index} />
              ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default Board
