import React from 'react';
import { useSelector } from 'react-redux';

export default function ChatListItem({ profilePicture, chatName, lastMessage, userId }) {
    const onlineUsers = useSelector(state => state.socket.onlineUsers.map(user => user.userId));
    const isOnline = onlineUsers.includes(userId);

    return (
        <div className='bg-base-200 rounded-md m-2 flex items-center px-3 py-2 hover:bg-base-300'>
            <div className={`avatar ${isOnline? "online" : "offline"}`}>
                <div className="w-12 rounded-full relative">
                    <img src={profilePicture} alt={chatName} />
                </div>
            </div>
            <div className='mx-2'>
                <div className='font-semibold'>
                    {chatName}
                </div>
                <div className='text-xs'>
                    {lastMessage}
                </div>
            </div>
        </div>
    );
}
