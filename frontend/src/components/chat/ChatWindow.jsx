import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from '../../store/slice/messageSlice';
import { getSender, getSenderFull } from '../../logic/chat';
import SelectedChatTopBar from './SelectedChatTopBar';
import ChatInputBox from './ChatInputBox';

export default function ChatWindow() {
  const dispatch = useDispatch();
  const { selectedChat } = useSelector((state) => state.chat);
  const { messages } = useSelector((state) => state.messages);
  const loggedUser = useSelector(state => state.auth.user);

  // const messageEndRef = useRef(null); // To reference the bottom of the chat container

  useEffect(() => {
    if (selectedChat) {
      dispatch(fetchMessages(selectedChat._id));
    }
  }, [dispatch, selectedChat]);

  // Scroll to the bottom when messages change (to ensure the latest message is visible)
  // useEffect(() => {
  //   if (messageEndRef.current) {
  //     messageEndRef.current.scrollTop = 0;
  //   }
  // }, [messages]); // This effect will run when the messages change

  return (
    <>
      {
        selectedChat ? (
          <div className='flex flex-col bg-base-100 m-2 w-3/4 rounded-lg max-h-[calc(100vh-80px)]'>
            <SelectedChatTopBar
              profilePhoto={getSenderFull(loggedUser, selectedChat.users).profilePhoto}
              name={getSender(loggedUser, selectedChat.users)} />
            <div className='flex flex-col flex-1 overflow-hidden p-2'>
              {/* Message container with scroll */}
              <div className='flex-1 overflow-y-auto p-2 m-2 flex flex-col-reverse'>
                {/* Render messages in reverse order to make them appear from bottom to top */}
                {[...messages].reverse().map((message, index) => (
                  <div key={index} className={`chat ${message.sender._id === loggedUser._id ? 'chat-end' : 'chat-start'}`}>
                    <div className="chat-bubble">{message.content}</div>
                  </div>
                ))}
                {/* Empty div at the end of the chat container to scroll to */}
                <div  />
              </div>
              {/* Input box at the bottom */}
              <ChatInputBox />
            </div> 
          </div>
        ) : (
          <div className='flex items-center justify-center bg-base-100 m-2 rounded-lg w-3/4'>
            <div className='text-2xl'>
              Click on a user to start chatting
            </div>
          </div>
        )
      }
    </>
  );
}
