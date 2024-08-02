"use client";

import { useState, useEffect, useRef } from "react";
import { useSocket } from "../../../context/SocketContextProvider";
import { useRouter } from "next/navigation";
import logo from "../../../public/Purple_logo.png";
import "./strangersroomcss.css"

export default function MeetStrangersRoom({ params }: { params: { roomnumber: string } }) {
    const router = useRouter();
    const { sendRoomMessage, allRoomMessages, username, currentStrangerRoom, startChat, stopChat } = useSocket();
    const scrollToBottomRef = useRef<HTMLDivElement | null>(null);
    const[chatIsStopped, setChatIsStopped] = useState(true);
    const [message, setMessage] = useState('');
    const [searchingToast, setSearchingToast] = useState(false);
    const [userDisconnected, setUserDisconnected] = useState(false);

    useEffect(() => {
        if (scrollToBottomRef.current) {
            scrollToBottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [allRoomMessages]);

    useEffect(() => {
        if (username === "") {
            window.location.replace("/");
        }

        const handlePopState = () => {
            window.location.replace("/");
        };

        history.pushState(null, window.location.href);
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [username]);

    useEffect(() => {
        if (!chatIsStopped) {
            if (currentStrangerRoom === "stopped"){
                setUserDisconnected(true);
                setChatIsStopped(true);
            }
            else if(currentStrangerRoom === null) {
                setSearchingToast(true);
                setUserDisconnected(false);

            }
            else {
                setSearchingToast(false);
                setUserDisconnected(false);
            }
        }
        else{
            setSearchingToast(false);
        }
    }, [chatIsStopped, currentStrangerRoom]);

    const handleSendMessage = () => {
        if (currentStrangerRoom && message.trim()) {
            sendRoomMessage(currentStrangerRoom, message);
            setMessage('');
        }
    };

    const handleStartChat = () => {
      setChatIsStopped(false);
      startChat();
    }

    const handleStopChat = () => {
      setChatIsStopped(true);
      setUserDisconnected(true);
      stopChat();
    }

    const getCurrentTime = (dateobj: Date) => {
        const hour = dateobj.getHours();
        const minute = dateobj.getMinutes();
        return `${hour}:${minute < 10 ? '0' : ''}${minute}`;
    };

    return (
        <>
            <div className="min-h-screen flex flex-col bg-black">
                <div className="border-b border-gray-700 bg-black text-white p-4 sticky top-0 z-10 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Strangers Room</h1>
                    <a href="/">
                        <img src={logo.src} alt="Purple Logo" className="h-14" />
                    </a>
                </div>
                {searchingToast && (
                    <div className="toast toast-start z-20 top-24 left-0">
                        <div className="alert alert-info">
                            <span>Searching for a user...</span>
                        </div>
                    </div>
                )}
                {userDisconnected && (
                    <div className="toast toast-start z-20 top-24 left-0">
                        <div className="alert bg-red-700 text-gray-200">
                            <span>Chat Disconnected!</span>
                        </div>
                    </div>
                )}
                <div className="flex-1 p-4 overflow-y-auto">
                    {allRoomMessages.map((each, index) => (
                        each.isOwn ? (
                            <div key={index} className="chat chat-end mb-4">
                                <div className="chat-header text-sm opacity-50 text-gray-100 pr-2 mb-1">
                                    You
                                    <time className="text-xs opacity-50 ml-1">{getCurrentTime(new Date(each.timestamp))}</time>
                                </div>
                                <div className="chat-bubble bg-gray-800 text-blue-300">{each.message}</div>
                            </div>
                        ) : (
                            <div key={index} className="chat chat-start mb-4">
                                <div className="chat-image avatar">
                                    <div className="w-10 rounded-full">
                                        <img alt="User avatar" src="https://i.pinimg.com/originals/ed/63/5c/ed635c29fffe09d3c1f706ca2cc6e404.jpg" />
                                    </div>
                                </div>
                                <div className="chat-header text-sm opacity-50 text-gray-100 pl-2 mb-1">
                                    {each.username}
                                    <time className="text-xs opacity-50 ml-1">{getCurrentTime(new Date(each.timestamp))}</time>
                                </div>
                                <div className="chat-bubble text-green-300">{each.message}</div>
                            </div>
                        )
                    ))}
                    <div ref={scrollToBottomRef}></div>
                </div>
                <div className="p-4 bg-black border-t border-gray-800 flex sticky bottom-0 z-50">
                    {chatIsStopped ? (<button 
                                      className="btn btn-primary"
                                      onClick={handleStartChat}>
                                      Start
                                    </button>) :
                                    (<button 
                                      className="btn btn-primary"
                                      onClick={handleStopChat}>
                                      {searchingToast ? (<span className="loading loading-ring loading-md text-white"></span>) : (<span> Stop </span>)}
                                    </button>)
                      }
                    <input
                        type="text"
                        className="input input-bordered bg-gray-800 flex-1 ml-2 text-gray-400"
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type message"
                        value={message}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage() }}
                    />
                </div>
            </div>
        </>
    );
}
