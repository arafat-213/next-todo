'use client'
import { useState, Fragment, useRef, FormEvent } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useModalStore } from '@/store/ModalStore'
import { useBoardStore } from '@/store/BoardStore'
import TaskTypeRadioGroup from './TaskTypeRadioGroup'
import Image from 'next/image'
import { PhotoIcon } from '@heroicons/react/24/solid'

function Modal() {
  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal
  ])

  const [newTaskInput, setNewTaskInput, newTaskType, image, setImage, addTodo] = useBoardStore(
    (state) => [
      state.newTaskInput,
      state.setNewTaskInput,
      state.newTaskType,
      state.image,
      state.setImage,
      state.addTodo
    ]
  )

  const imagePickerRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
    if(!newTaskInput) return
    await addTodo(newTaskInput, newTaskType , image)
    // save the todo in appwrite database
    // close the modal
    closeModal()
    setImage(null)
  }
  return (
    // Use the `Transition` component at the root level
    <Transition show={isOpen} as={Fragment}>
      <Dialog as='form' className='relative z-10' onClose={closeModal} onSubmit={handleSubmit}>
        {/*
              Use one Transition.Child to apply one transition to the backdrop...
            */}
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opactiy-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>
        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900'
                >
                  Add a Task
                </Dialog.Title>
                <div className='mt-2'>
                  <input
                    type='text'
                    className='w-full rounded-md border border-gray-300 p-5 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                    placeholder='Enter a title here'
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                  />
                  <TaskTypeRadioGroup />
                </div>
                <div>
                  <button
                    type='button'
                    className='w-full rounded-md border border-gray-300 p-5 outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-1'
                    onClick={(e) => {
                      e.preventDefault()
                      imagePickerRef.current?.click()
                    }}
                  >
                    <PhotoIcon className='mr-2 inline-block h-6 w-6' />
                    Upload Image
                  </button>
                  {image && (
                    <Image
                      src={URL.createObjectURL(image)}
                      alt='uploaded image'
                      width={200}
                      height={200}
                      className='mt-2 h-44 w-full cursor-not-allowed object-cover filter transition-all duration-150 hover:grayscale'
                      onClick={() => {
                        setImage(null)
                      }}
                    />
                  )}
                  <input
                    type='file'
                    ref={imagePickerRef}
                    hidden
                    onChange={(e) => {
                      // check if e is an image
                      if (!e.target.files![0].type.startsWith('image/')) return
                      setImage(e.target.files![0])
                    }}
                  />
                </div>

                <div className='w-full mt-3'>
                  <button className='inline-flex w-full justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300'
                  type='submit'
                  disabled={!newTaskInput}>
                    Add Task
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal
