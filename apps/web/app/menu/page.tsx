"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "../../context/SocketContextProvider";
import "./menupagecss.css";

export default function HomePage() {
    const router = useRouter();
    const { username } = useSocket();
    const [headerText, setHeaderText] = useState("Select a type");

    // Redirect to home page if username is not set
    if (username === "") router.push("/");

    return (
        <div className="min-h-screen flex items-center justify-center gridline-background">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-4xl font-bold text-white mb-6">{headerText}</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
  className="h-[16em] w-[18em] border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(75,30,133,1)] to-[rgba(75,30,133,0.01)] text-white font-nunito p-[1em] flex justify-center items-left flex-col gap-[0.75em] backdrop-blur-[12px]"
>
  <div>
    <h1 className="text-[2em] font-medium">Meet Strangers</h1>
    <p className="text-[0.85em]">
      Chat one-on-one and make friends with people across the globe with determinism. Secure, private and anonymous!
    </p>
  </div>

  <button
    className="h-fit w-fit px-[1em] py-[0.25em] border-[1px] rounded-full flex justify-center items-center gap-[0.5em] overflow-hidden group hover:translate-y-[0.125em] duration-200 backdrop-blur-[12px]"
  >
    <p>Coming Soon</p>
    <svg
      className="w-6 h-6 group-hover:translate-x-[10%] duration-300"
      stroke="currentColor"
      stroke-width="1"
      viewBox="0 0 24 24"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
        stroke-linejoin="round"
        stroke-linecap="round"
      ></path>
    </svg>
  </button>
</div>

                    <div
                        className="relative overflow-hidden rounded-lg shadow-lg bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                        onMouseEnter={() => setHeaderText("Click to enter")}
                        onMouseLeave={() => setHeaderText("Select a type")}
                    >
                        <button
                            onClick={() => router.push("/chat/public")}
                            className="block w-full h-full py-10 px-6 text-2xl font-semibold text-white transform transition duration-300 hover:scale-105 focus:outline-none"
                        >
                            Public Room
                        </button>
                    </div>
                    <div
                        className="relative overflow-hidden rounded-lg shadow-lg bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
                        onMouseEnter={() => setHeaderText("Click to enter")}
                        onMouseLeave={() => setHeaderText("Select a type")}
                    >
                        <button
                            onClick={() => router.push("/chat/private")}
                            className="block w-full h-full py-10 px-6 text-2xl font-semibold text-white transform transition duration-300 hover:scale-105 focus:outline-none"
                        >
                            Private Room
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
