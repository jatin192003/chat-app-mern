import React from 'react'

export default function SelectedChatTopBar({profilePhoto, name}) {
    return (
        <div className='w-full'>
            <div className="navbar bg-base-200 rounded-t-lg">
                <div className="avatar">
                    <div className="w-10 rounded-full">
                        <img src={profilePhoto} />
                    </div>
                </div>
                <div className='font-semibold mx-2'>{name}</div>
            </div>
        </div>
    )
}
