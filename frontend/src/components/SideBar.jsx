import React, { use, useContext, useEffect, useState } from 'react'
import { Context } from '../Context/Main';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MdOutlineDelete } from "react-icons/md";

export default function SideBar() {
    const navigator = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { userData, userChats, fetchChats, fetchMessages, setCurrentChat, currentChat } = useContext(Context);

    useEffect(() => {
        fetchChats(userData?._id);
    }, [userData]);



    useEffect(() => {
        if (!currentChat) {
            return;
        } else {
            setSearchParams({ chatId: currentChat } || null);
        }
    }, [currentChat]);
    // console.log(userChats);

    useEffect(() => {
        if (!searchParams.get("chatId")) {
            return;
        } else {
            fetchMessages(searchParams.get("chatId"), currentChat);
        }
    }, [searchParams.get("chatId"), currentChat]);





    const Logout = async () => {
        try {
            const res = await axios.post(
                "/api/user/logout",
                {},
                {
                    withCredentials: true,
                }
            );
            localStorage.removeItem("user");
            navigator("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const createChat = async () => {
        try {
            const res = await axios.post(
                "/api/chat/createChat",
                { userId: userData._id, chatName: `Chat with 45464` },
                {
                    withCredentials: true,
                }
            );
            if (res.data) {
                fetchChats(userData._id);
            }

        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };


    const deleteChat = async (id) => {
        try {
            await axios.delete(`/api/chat/deleteChatById/${id}`,
                {
                    _id: id
                },
                {
                    withCredentials: true,
                }
            );
            fetchChats(userData._id);
        }
        catch (error) {
            console.error("Error deleting chat:", error);
        }
    }
    


    return (
        <aside className=" border  bg-[#f1f2f3] border-gray-300 py-4 px-1 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2">
                    <div
                        className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
                    <h1 className="text-base font-bold md:text-2xl">Virox AI</h1>
                </div>
                <button onClick={createChat} className="w-full bg-blue-500 text-white py-2 mt-5 rounded mb-4">
                    + New chat
                </button>
                {
                    Array.isArray(userChats) && userChats.length > 0 ? (
                        [...userChats]
                            .sort((a, b) => {
                                if (!a.createdAt && !b.createdAt) return 0;
                                if (!a.createdAt) return 1;
                                if (!b.createdAt) return -1;
                                return b.createdAt.localeCompare(a.createdAt);
                            })
                            .map((chat, index) => (
                                <div key={index} className=" hover:bg-gray-200 rounded cursor-pointer flex justify-between items-center ">
                                    <div onClick={() => setCurrentChat(chat._id)} className=' p-2 px-5 w-full'>
                                        {chat.name || `Chat ${index + 1}`}
                                    </div>
                                    <MdOutlineDelete onClick={() => deleteChat(chat._id)} className='w-8 ' size={20} />
                                </div>
                            ))
                    ) : (
                        <p className="text-gray-500">No chats available</p>
                    )
                }

            </div>

            <div className="text-sm  flex flex-col gap-3  text-gray-700  border-gray-300 ">
                <div className="flex gap-3 rounded-xl  cursor-pointer hover:bg-gray-200 px-4 py-2" >

                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-white text-lg font-semibold">
                        {userData?.firstName?.charAt(0)}
                    </div>
                    <div>
                        <p className="font-semibold">{userData?.firstName} {userData?.lastName}</p>
                        <p className="text-gray-500">Free</p>
                    </div>
                </div>

                <button
                    onClick={Logout}
                    className="w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Logout
                </button>
            </div>

        </aside>
    )
}
