import React, { useState } from 'react';
import Navbar from '../components/chat/Navbar';
import Sidebar from '../components/chat/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import { useSelector } from 'react-redux';

export default function ChatPage() {
  const [showChatWindow, setShowChatWindow] = useState(false);
  const { selectedChat } = useSelector((state) => state.chat);

  const handleChatSelect = () => {
    setShowChatWindow(true);
  };

  const handleBackToSidebar = () => {
    setShowChatWindow(false);
  };

  return (
    <div className='flex flex-col h-screen bg-base-300'>
      <Navbar />
      <div className='flex flex-1 overflow-hidden'>
        {/* Sidebar: Always visible on large screens, conditionally visible on small screens */}
        <div className={`${showChatWindow ? 'hidden lg:block' : 'w-full'} lg:w-1/4`}>
          <Sidebar onChatSelect={handleChatSelect} />
        </div>

        {/* Chat Window: Conditionally visible based on screen size and chat selection */}
        <div className={`${showChatWindow ? 'w-full' : 'hidden lg:block'} lg:w-3/4`}>
          {selectedChat ? (
            <ChatWindow onBack={handleBackToSidebar} />
          ) : (
            <div className='flex items-center justify-center bg-base-100 m-2 rounded-lg h-[calc(100vh-80px)]'>
              <div className='text-2xl'>
                Click on a user to start chatting
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}