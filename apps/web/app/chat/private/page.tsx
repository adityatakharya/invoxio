"use client";

import React, { useState, useEffect } from "react";
import { useSocket } from "../../../context/SocketContextProvider";
import { useRouter } from "next/navigation";
import "./enterroomcss.css"
import logo from "../../../public/Purple_logo.png";

export default function EnterRoom() {
    const router = useRouter();
    const { joinRoom, username } = useSocket();

    useEffect(() => {
        if (username === "") {
            window.location.replace("/");
        }

        const handlePopState = () => {
            window.location.replace("/");
        };

        // Add a state to the history stack
        history.pushState(null, window.location.href);
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [username]);

    const [roomNumber, setRoomNumber] = useState("");
    const [currentRoom, setCurrentRoom] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleJoinRoom = () => {
        setIsLoading(true);
        setTimeout(() => {
            joinRoom(roomNumber);
            setCurrentRoom(roomNumber);
            setRoomNumber("");
            router.push(`/chat/private/${roomNumber}`);
        }, 3000);
    }

    return (
        
        <>
            <div className="stars"></div>
            <div className="twinkling"></div> 
            <div className="clouds"></div>
        <div className="min-h-screen flex items-center justify-center title">
            <div className="max-w-md w-full p-6 rounded-lg">
                <div className="text-center mb-8">
                    <a href="/"><img src={logo.src} alt="Logo" className="mx-auto h-52 w-52 showontop z-50 fadeanim" /></a>
                </div>
                <h2 className="text-3xl font-bold mb-4 text-center text-white fadeanim">Create or Join a Room</h2>
                <div className="mt-8 space-y-3 justify-content text-center">
                <input 
                        type="text" 
                        name="text" 
                        className="rninput z-50" 
                        onChange={(e) => setRoomNumber(e.target.value)}
                        value={roomNumber}
                        placeholder="Enter room code" 
                        onKeyDown={(e) => {if(e.key==="Enter") {if(roomNumber!=="") handleJoinRoom()}}}
                    />
                    <button type="button" onClick={(e) => {if(roomNumber!=="") handleJoinRoom()}} className="fill showontop z-50 fadeanim">{isLoading ? (<span className="loading lloading-ring loading-sm"></span>) : (<span>Enter</span>)}</button>
                    
                </div>
                {currentRoom && (
                    <div className="bg-gray-800 bg-opacity-60 p-4 mt-10 rounded-lg text-center text-gray-300 showontop z-50">
                        Joined Room: {currentRoom}
                    </div>
                )}
            </div>
        </div>
        </>
    );
}
