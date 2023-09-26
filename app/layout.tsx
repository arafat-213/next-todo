import Modal from '@/components/Modal'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'More than Just TODOs',
  description: 'It is more than just a TODO app, honestly it is.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className='bg-[#F5F6F8]'>{children}
      <Modal />
      </body>
    </html>
  )
}
