import axios from 'axios';
import React, { use, useEffect, useState } from 'react'
import { createContext } from 'react'
import { useNavigate } from 'react-router-dom';

const Context = createContext();

export default function Main(props) {
    const [userData, setUserData] = useState(null);
    const [userChats, setUserChats] = useState([]);
    const [userMessages, setUserMessages] = useState([]);
    const USER_URL = '/user'
     const [currentChat, setCurrentChat] = useState(null);
    // const fetchUser = async (id) => {
    //     try {
    //         const response = await axios.get(`${API_BASE_URL}${USER_URL}/${id}`, {
    //             withCredentials: true
    //         });

    //         if (response.data) {
    //             setUserData(response.data);
    //             console.log("User data fetched:", response.data);
    //             return response.data; // useful if caller needs the data
    //         } else {
    //             console.warn("No user data received");
    //             return null;
    //         }

    //     } catch (error) {
    //         console.error("Error fetching user data:", error);
    //         return null;
    //     }
    // };


    // const fetchUser = (id) => {
    //     let API = `${API_BASE_URL}${USER_URL}/${id}`;
    //     axios.get(API)
    //         .then(
    //             (success) => {
    //                 if (success.data) {
    //                     setUserData(success.data);
    //                     console.log(success.data);
    //                 }
    //             }
    //         ).catch(
    //             (err) => {
    //                 console.log(err.message);
    //             setUserData(null);
    //             }
    //         )
    // }

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

    const fetchMessages = (chatId = null) => {
        let API = `/api/chat/getAllMessagesByChatId/${chatId}`;
        if(!chatId) {
            return; // No current chat, no need to fetch messages
        }
        axios.get(API)
            .then(
                (success) => {
                    if (success.data) {
                        setUserMessages(success.data.messages);
                        // Set the current chat ID
                    } else {
                        setUserMessages([]);
                        ; // Reset current chat if no messages
                    }
                }
            ).catch(
                (err) => {
                    setUserMessages([]);
                   ; // Reset current chat if error occurs
                }
            )
    }



    return (
        <Context.Provider value={{ userChats, userData, USER_URL,currentChat,setCurrentChat, setUserData, fetchChats, fetchMessages, userMessages }}>
            {props.children}
        </Context.Provider>
    )
}

export { Context };
