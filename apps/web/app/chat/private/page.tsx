"use client";

import React, { useState, useEffect } from "react";
import { useSocket } from "../../../context/SocketContextProvider";
import { useRouter } from "next/navigation";
import "./enterroomcss.css";
import logo from "../../../public/Purple_logo.png";
import useEnsureUser from "../../hooks/useEnsureUser";
import usePreventBackNavigation from "../../hooks/usePreventBackNavigation";

export default function EnterRoom() {
    // Router instance from Next.js to handle navigation
    const router = useRouter();
    
    // Destructure joinRoom and username from the Socket context
    const { joinRoom, username } = useSocket();

    // Custom hooks to ensure user is logged in and prevent back navigation
    useEnsureUser(username);
    usePreventBackNavigation();

    // Local state for managing room number input, current room, and loading status
    const [roomNumber, setRoomNumber] = useState("");
    const [currentRoom, setCurrentRoom] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Function to handle joining a room
    const handleJoinRoom = () => {
        setIsLoading(true); // Show loading indicator
        setTimeout(() => {
            // Join the room with the provided room number
            joinRoom(roomNumber);
            setCurrentRoom(roomNumber); // Update current room state
            setRoomNumber(""); // Clear room number input
            router.push(`/chat/private/${roomNumber}`); // Navigate to the private chat room
        }, 3000); // Simulate a delay of 3 seconds
    };

    return (
        <>
            {/* Background effects */}
            <div className="stars"></div>
            <div className="twinkling"></div> 
            <div className="clouds"></div>

            {/* Main container for the Enter Room page */}
            <div className="min-h-screen flex items-center justify-center title">
                <div className="max-w-md w-full p-6 rounded-lg">
                    {/* Logo and title */}
                    <div className="text-center mb-8">
                        <a href="/"><img src={logo.src} alt="Logo" className="mx-auto h-52 w-52 showontop z-50 fadeanim" /></a>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-center text-white fadeanim">Create or Join a Room</h2>
                    
                    {/* Input field for room number and loading indicator */}
                    <div className="mt-8 space-y-3 justify-content text-center">
                        {isLoading ? (
                            // Show loading animation when isLoading is true
                            <span className="loading loading-bars loading-lg"></span>
                        ) : (
                            <input 
                                type="text" 
                                name="text" 
                                className="rninput z-50" 
                                onChange={(e) => setRoomNumber(e.target.value)} // Update room number state
                                value={roomNumber} // Controlled input value
                                placeholder="Enter room code" 
                                onKeyDown={(e) => {
                                    // Handle Enter key press to join the room
                                    if(e.key === "Enter" && roomNumber !== "") {
                                        handleJoinRoom();
                                    }
                                }}
                            />
                        )}
                    </div>
                    
                    {/* Display current room information if available */}
                    {currentRoom && (
                        <div className="bg-gray-800 bg-opacity-60 p-4 mt-10 rounded-lg text-center text-gray-300 showontop z-50 fadeanim">
                            Joined Room: {currentRoom}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}