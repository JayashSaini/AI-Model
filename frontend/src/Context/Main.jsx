import axios from 'axios';
import React, { use, useEffect, useState } from 'react'
import { createContext } from 'react'
import { useNavigate } from 'react-router-dom';

const Context = createContext();

export default function Main(props) {
    const userData = JSON.parse(localStorage.getItem("user")) || null;
    

    const USER_URL = '/user'
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

    return (
        <Context.Provider value={{ userData, USER_URL }}>
            {props.children}
        </Context.Provider>
    )
}

export { Context };
