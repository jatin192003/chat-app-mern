import React from 'react'
import Navbar from '../components/chat/Navbar'
import Sidebar from '../components/chat/Sidebar'
import ChatWindow from '../components/chat/ChatWindow'

export default function ChatPage() {

  return (
    <div className='flex flex-col h-screen bg-base-300'>
      <Navbar />
      <div className='flex flex-1'>
        <Sidebar />
        <ChatWindow />
      </div>
    </div>
  )
}
