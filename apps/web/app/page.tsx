"use client";

import React, { useState } from "react";
import { useSocket } from "../context/SocketContextProvider";
import { useRouter } from "next/navigation";
import "./homepagecss.css";
import logo from "../public/Purple_logo.png";

export default function EntryPage() {

    const { setUsernameFunc } = useSocket();
    const [typedUsername, setTypedUsername] = useState("");
    const [invalidUsernameErr, setInvalidUsernameError] = useState(false);
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const router = useRouter();

    const handleSetUsername = () => {
        if(typedUsername===""){
          setInvalidUsernameError(true);
          return;
        }
        setUsernameFunc(typedUsername);
        router.push("/menu");
    };

    return (
        <>
        <body className="animated-body">
<nav className="fixed w-full z-20 top-0 start-0">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
      <img src={logo.src} className="h-14" alt="Logo"/>
  </a>
  <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
      <a href="https://portfolio-adityat.vercel.app/"><button type="button" className="border border-gray-400 hover:border-black font-medium rounded-lg text-sm px-4 py-2 text-center text-white  hover:bg-purple-600 focus:ring-gray-200">Hire Me</button></a>
      <button 
          type="button" 
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" 
          aria-controls="navbar-sticky" 
          aria-expanded={isNavbarOpen} 
          onClick={() => setIsNavbarOpen(!isNavbarOpen)}
      >
        <span className="sr-only">Open main menu</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14"> 
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
    </button>
  </div>
  <div className={`items-center justify-between ${isNavbarOpen ? 'block' : 'hidden'} w-full md:flex md:w-auto md:order-1`} id="navbar-sticky">
    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
      <li>
        <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
      </li>
      <li>
        <a href="https://github.com/adityatakharya/invoxio" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">View Source Code</a>
      </li>
      <li>
        <a href="https://portfolio-adityat.vercel.app/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
      </li>
    </ul>
  </div>
  </div>
</nav>
{invalidUsernameErr && (
            <div className="toast toast-start z-50 top-24 left-0">
                <div className="alert alert-danger bg-red-700 text-gray-400">
                    <span>Enter a valid username!</span>
                </div>
            </div>
        )}
        <div className="hero min-h-screen">
            <div className=""></div>
            <div className="hero-content text-neutral-content text-center">
            <div className="max-w-md">
                <h1 className="mb-5 text-5xl font-bold text-white hh1">Invoxio Chatrooms</h1>
                <p className="mb-5">
                Secure and anonymous chatrooms for all your purposes. Experience a platform designed to make your every conversation special.
                </p>
                <div className="mt-8 space-y-1 justify-content text-center">
                    <input
                        type="text"
                        value={typedUsername}
                        onChange={(e) => setTypedUsername(e.target.value)}
                        className="input input-3d input-bordered w-48 mr-4 border-gray-600 bg-black text-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-inner"
                        placeholder="Create an username"
                        onKeyDown={(e) => {if(e.key==="Enter"){handleSetUsername()}}}
                    />
                    <button
                        onClick={handleSetUsername}
                        className="btn btn-3d btn-primary w-24 mt-4 border-purple-300 px-4 py-2 rounded-md bg-black text-white focus:outline-none shadow-inner"
                    >
                        Enter
                    </button>
                </div>
            </div>
        </div>
        </div>
        </body>
        </>
    );
}
