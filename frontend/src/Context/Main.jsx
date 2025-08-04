import axios from 'axios';
import React, { use, useEffect, useState } from 'react'
import { createContext } from 'react'
import { useNavigate } from 'react-router-dom';

const Context = createContext();

export default function Main(props) {
    const user = JSON.parse(localStorage.getItem("user"));
    const [userData, setUserData] = useState(null);
    const [userChats, setUserChats] = useState([]);
    const [userMessages, setUserMessages] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);

    useEffect(() => {
        if (user === !userData) {
            setUserData(user);
        }
    }, [user]);


    if (!userData && user) {
        setUserData(user);
    }

    const fetchChats = (id) => {
        let API = `/api/chat/getChatsByUserId/${id}`;
        axios.get(API)
            .then(
                (success) => {
                    if (success.data) {
                        setUserChats(success.data.chats);
                    } else {
                        setUserChats([]);
                    }
                }
            ).catch(
                (err) => {
                    setUserChats([]);
                }
            )
    }




    const fetchMessages = (chatId) => {
        let API = `/api/chat/getAllMessagesByChatId/${chatId}`;
        if (!chatId) {
            return; 
        }
        axios.get(API)
            .then(
                (success) => {
                    if (success.data) {
                        setUserMessages(success.data.messages);
                    } else {
                        setUserMessages([]);
                        ; 
                    }
                }
            ).catch(
                (err) => {
                    setUserMessages([]);
                    ; 
                }
            )
    }



    return (
        <Context.Provider value={{ userChats, userData, currentChat,setUserMessages, setCurrentChat, setUserData, fetchChats, fetchMessages, userMessages }}>
            {props.children}
        </Context.Provider>
    )
}

export { Context };
