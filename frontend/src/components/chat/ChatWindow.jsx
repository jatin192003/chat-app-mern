import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from '../../store/slice/messageSlice';
import { getSender, getSenderFull } from '../../logic/chat';
import SelectedChatTopBar from './SelectedChatTopBar';
import ChatInputBox from './ChatInputBox';
import { IoIosArrowBack } from 'react-icons/io'; // NEW: Import back arrow icon

// NEW: Add onBack prop
export default function ChatWindow({ onBack }) {
  const dispatch = useDispatch();
  const { selectedChat } = useSelector((state) => state.chat);
  const { messages } = useSelector((state) => state.messages);
  const loggedUser = useSelector(state => state.auth.user);

  const messageEndRef = useRef(null); // To reference the bottom of the chat container


  useEffect(() => {
    if (selectedChat) {
      dispatch(fetchMessages(selectedChat._id));
    }
  }, [dispatch, selectedChat]);

  // UPDATED: Scroll to the bottom when messages change (to ensure the latest message is visible)
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
    }
  }, [messages]); // This effect will run when the messages change

  return (
    <>
          <div className='flex flex-col h-[calc(100vh-80px)] bg-base-100 m-2 rounded-lg'>
            {/* Top Bar */}
            <div className="flex items-center justify-start border-b bg-base-200 rounded-lg border-base-300">
                {/* NEW: Back button (visible only on mobile/tablet) */}
                <button onClick={onBack} className="lg:hidden mr-3">
                    <IoIosArrowBack size={24} />
                </button>
                <SelectedChatTopBar
                  profilePhoto={getSenderFull(loggedUser, selectedChat.users).profilePhoto}
                  name={getSender(loggedUser, selectedChat.users)} 
                />
            </div>
            <div className='flex flex-col flex-1 p-2 overflow-hidden'>
              {/* Message container with scroll */}
              <div className='flex-1 overflow-y-auto p-2 m-2 flex flex-col-reverse'>
                {/* UPDATED: removed flex-col-reverse to display messages from top to bottom */}
                {[...messages].reverse().map((message, index) => (
                  <div key={index} className={`chat ${message.sender._id === loggedUser._id ? 'chat-end' : 'chat-start'}`}>
                    <div className="chat-bubble">{message.content}</div>
                  </div>
                ))}
                {/* Empty div at the end of the chat container to scroll to */}
                <div ref={messageEndRef} />
              </div>
              {/* Input box at the bottom */}
              <ChatInputBox />
            </div> 
          </div>
    </>
  );
}