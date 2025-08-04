import React, { useState } from 'react'
import { FaEye } from "react-icons/fa";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEyeSlash } from "react-icons/fa";

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstname] = useState('')
    const [lastName, setLastname] = useState('')
    const [showpassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const navigator = useNavigate();


    const handleValidation = () => {
        if (!email) {
            setError("Email is required.");
        } else if (!firstName || !lastName) {
            setError("Name is required.");
        } else if (!password) {
            setError("Password is required.");
        } else {
            setError("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            axios.post(
                '/api/user/register',
                {
                    email, password, firstName, lastName
                }
            ).then(
                (success) => {
                    if (!success.data) {
                        setError(success.data.msg)
                    } else {
                        navigator("/login")
                    }
                }
            )
        } catch (error) {
            console.log(error.message);
            setError("Login failed. Please try again.")
        }
    };

    return (
        <div className="flex relative flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className='absolute top-10 '>
                <img src="images/iSHOP Logo.svg" alt="" />
            </div>
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className='flex gap-2'>
                        <div>
                            <label htmlFor="Firstname" className="block text-sm font-bold">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="Firstname"
                                onBlur={handleValidation}
                                value={firstName}
                                onChange={(e) => setFirstname(e.target.value)}
                                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder='First name'
                            />
                        </div>

                        <div>
                            <label htmlFor="Lastname" className="block text-sm font-bold">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="Lastname"
                                onBlur={handleValidation}
                                value={lastName}
                                onChange={(e) => setLastname(e.target.value)}
                                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder='Last name'
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-bold">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onBlur={handleValidation}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder='Email'
                        />
                    </div>

                    <div className='relative'>
                        <label htmlFor="password" className="block text-sm font-bold">
                            Password
                        </label>
                        <FaEyeSlash onClick={() => setShowPassword(false)} className={`absolute hover:text-gray-500 cursor-pointer z-10 top-1/2 right-3 ${showpassword ? "block" : 'hidden'} `} fontSize={27} />
                        <FaEye onClick={() => setShowPassword(true)} className={`absolute top-1/2 hover:text-gray-500 cursor-pointer right-3 ${showpassword ? "hidden" : 'block'}  `} fontSize={26} />
                        <input
                            type={showpassword == true ? 'text' : "password"}
                            id="password"
                            value={password}
                            minLength="6"
                            onBlur={handleValidation}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder='At least 6 characters'
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center text-gray-600">
                    Already have an account? {' '}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
