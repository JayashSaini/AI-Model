import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { Context } from '../Context/Main';
import { AiOutlineLoading3Quarters } from "react-icons/ai";


export default function Login() {
    const { API_BASE_URL, USER_URL, fetchUser } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate();
    const [email, setEmail] = useState('user@gmail.com');
    const [password, setPassword] = useState('1234567890');
    const [showpassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`/api/${USER_URL}/login`,
                { email, password },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,

                }
            );
            if (!response.data) {
                setError(response.data.msg);
            } try {
                const userResponse = await axios.get(`/api/${USER_URL}/${response.data._id}`, {
                    withCredentials: true
                });
                localStorage.setItem("user", JSON.stringify(userResponse.data));
                navigator("/");
            }
            catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to fetch user data. Please try again.");
            }
        }
        catch (error) {
            console.log(error.message);
            setError("Login failed. Please try again.");
        }
    };

    return (
        <>

            <div className="flex relative flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className='absolute top-10 '>
                    <img src="images/iSHOP Logo.svg" alt="" />
                </div>
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
                    {error && <p className='mb-4 text-red-500'>{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className='relative'>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                                Password
                            </label>
                            <FaEyeSlash onClick={() => setShowPassword(false)} className={`absolute hover:text-gray-500 cursor-pointer z-10 top-1/2 right-3 ${showpassword ? "block" : 'hidden'} `} fontSize={27} />
                            <FaEye onClick={() => setShowPassword(true)} className={`absolute top-1/2 hover:text-gray-500 cursor-pointer right-3 ${showpassword ? "hidden" : 'block'}  `} fontSize={26} />
                            <input
                                type={showpassword == true ? 'text' : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {
                            loading ? (
                                <><div className='flex justify-center items-center gap-2 w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>

                                    <AiOutlineLoading3Quarters className="animate-spin  " size={25} />
                                    Logging in...
                                </div>
                                </>
                            )
                                : (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Login
                                    </button>
                                )
                        }
                    </form>

                    <div className="relative w-full  p-3 text-gray-600">
                        <hr className='border-[1px]' />
                        <div className='absolute  top-0 left-1/4  bg-white px-1 '>
                            Don’t have an account yet?{" "}
                        </div>
                    </div>
                    <div onClick={() => navigator('/register')} className=' border text-center p-1 rounded-xl shadow hover:bg-gray-50 cursor-pointer border-gray-300 hover:shadow-lg '>
                        Sign up

                    </div>
                </div>
            </div >
        </>
    );
}
