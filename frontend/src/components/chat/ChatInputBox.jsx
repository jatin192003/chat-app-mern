import React, { useState } from 'react'
import { IoSend } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../store/slice/messageSlice';

export default function ChatInputBox() {
    const [messageText, setMessageText] = useState("")
    const handleChange = (event) => {
        setMessageText(event.target.value);
    };
    const { selectedChat } = useSelector((state) => state.chat);
    const dispatch = useDispatch()
    
    let data = {
        "content":messageText,
        "chatId":selectedChat._id
    }

    const handleSend = () =>{
        dispatch(sendMessage(data))
        setMessageText("")
    }

    return (
        <label className="input input-bordered flex items-center gap-2">
            <input type="text" className="grow" value={messageText} onChange={handleChange} placeholder="Type your message" />
            <IoSend className={`cursor-pointer transition-opacity duration-300 ${
                    messageText ? 'opacity-100' : 'opacity-0'
                }`} onClick={handleSend}/>
        </label>

    )
}
