import React, { useEffect, useCallback, useState, useRef } from 'react';
import ChatListItem from './ChatListItem';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, setSelectedChat } from '../../store/slice/ChatSlice';
import { getSender, getSenderFull } from '../../logic/chat';
import { getOtherUser } from '../../store/slice/authSlice';
import { debounce } from 'lodash';
import { LuMessageCirclePlus } from "react-icons/lu";

export default function Sidebar() {
    const dispatch = useDispatch();
    const loggedUser = useSelector(state => state.auth.user);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const inputRef = useRef(null);

    const handleChatClick = (chat) => {
        dispatch(setSelectedChat(chat));
    };

    useEffect(() => {
        console.log("useEffect called");
        dispatch(fetchChats());
    }, [dispatch]);

    const chats = useSelector(state => state.chat.chats);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((query) => {
            if (query.length > 0) {
                dispatch(getOtherUser(query));
                setIsDropdownOpen(true); // Open dropdown when searching
            } else {
                setIsDropdownOpen(false); // Close dropdown when search is empty
            }
        }, 500),
        []
    );

    const searchUsers = (event) => {
        const query = event.target.value;
        debouncedSearch(query);
    };

    const searchedUsers = useSelector(state => state.auth.otherUser);
    console.log(searchedUsers);

    // Function to close the dropdown when clicking outside
    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col w-1/4 bg-base-100 m-2 rounded-lg relative">
            <div className="w-full p-3">
                <label className="input input-bordered flex items-center gap-2 relative">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Search"
                        onChange={searchUsers}
                        ref={inputRef} // Add ref to the input
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {/* Dropdown */}
                    {isDropdownOpen && searchedUsers.length > 0 && (
                        <ul className="absolute top-full left-0 w-full bg-base-100 shadow-md rounded-lg mt-2 z-10 max-h-60 overflow-y-auto">
                            {searchedUsers.map((user) => (
                                <li key={user._id} className="p-2 hover:bg-base-300 cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <div className='flex items-center'>
                                            <img
                                                src={user.profilePhoto}
                                                alt={user.fullName}
                                                className="w-8 h-8 rounded-full mr-2"
                                            />
                                            <span>{user.fullName}</span>
                                        </div>
                                        <span className='px-3 scale-105 hover:scale-125 ease-in-out duration-300'><LuMessageCirclePlus /></span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </label>
            </div>
            <div>
                {chats.map((items) => {
                    return (
                        <div onClick={()=>{handleChatClick(items)}} key={items._id}>
                            <ChatListItem
                                profilePicture={getSenderFull(loggedUser, items?.users).profilePhoto}
                                chatName={getSender(loggedUser, items?.users)}
                                lastMessage={items?.latestMessage?.content}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}