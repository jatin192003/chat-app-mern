import React from 'react'

export default function ChatListItem({profilePicture, chatName, lastMessage}) {
    return (
        <div className='bg-base-200 rounded-md m-2 flex items-center px-3 py-2 hover:bg-base-300'>
            <div className="avatar">
                <div className="w-12 rounded-full">
                    <img src={profilePicture} />
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
    )
}
