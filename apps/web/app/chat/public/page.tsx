'use client';

import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../../context/SocketContextProvider";
import { useRouter } from "next/navigation";
import logo from "../../../public/Purple_logo.png"
import "./publicroomcss.css"

export default function PublicChat() {

  interface Toast {
    id: number;
    message: string;
  }

  const router = useRouter();
  const { sendMessage, allPublicMessages, username, newSocketNotiPublic } = useSocket();
  const scrollToBottomRef = useRef<HTMLDivElement | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  useEffect(() => {
    if (username === "") window.location.replace("/");
  },[])

  useEffect(() => {
    if(scrollToBottomRef.current){
      scrollToBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allPublicMessages])

  useEffect(() => {
    if (newSocketNotiPublic) {
      const newToast = {
        id: toastIdRef.current++,
        message: "New user joined the chat!"
      };
      setToasts(prev => [...prev, newToast]);

      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== newToast.id));
      }, 5000);
    }
  }, [newSocketNotiPublic]);
  
  const getCurrentTime = (dateobj: any) => {
    const hour = dateobj.getHours();
    const minute = dateobj.getMinutes();
    return `${hour}:${minute < 10 ? '0' : ''}${minute}`;
  };
  
  const [message, setMessage] = useState('');

  return (
    <>
    <div className="min-h-screen flex flex-col bg-black">
    <div className="border-b border-gray-700 bg-black text-white p-4 sticky top-0 z-10 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Public Chat</h1>
        <a href="/">
          <img src={logo.src} alt="Purple Logo" className="h-14"/>
        </a>
      </div>
        {/* {showToast && ( */}
            <div className="toast toast-start z-20 top-24 left-0">
                {toasts.map(toast => (
                  <div key={toast.id} className="alert alert-success">
                    <span>{toast.message}</span>
                  </div>
                ))}
            </div>
        {/* )} */}
      <div className="flex-1 p-4 no-scrollbar overflow-y-auto">
        {allPublicMessages.map((each, index) => (
          each.isOwn ? (
            <div key={index} className="chat chat-end mb-4">
              <div className="chat-header text-sm  text-gray-100 opacity-50 pr-2 mb-1">
                You
                <time className="text-xs opacity-50 ml-1">{getCurrentTime(new Date(each.timestamp))}</time>
              </div>
              <div className="chat-bubble bg-gray-800 text-blue-300">{each.message}</div>
            </div>
          ) : (
            <div key={index} className="chat chat-start mb-4">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User avatar"
                    src="https://i.pinimg.com/originals/ed/63/5c/ed635c29fffe09d3c1f706ca2cc6e404.jpg" />
                </div>
              </div>
              <div className="chat-header text-sm  text-gray-100 opacity-50 pl-2 mb-1">
                {each.username}
                <time className="text-xs opacity-50 ml-1">{getCurrentTime(new Date(each.timestamp))}</time>
              </div>
              <div className="chat-bubble text-green-300">{each.message}</div>
            </div>
          )
        ))}
        <div ref={scrollToBottomRef}></div>
      </div>
      <div className="p-4 bg-black border-t border-gray-600 flex sticky bottom-0 z-30">
        <input
          type="text"
          className="input input-bordered bg-gray-800 flex-1 mr-2 text-gray-400"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message"
          value={message}
          onKeyDown={(e) => {if(e.key==="Enter") {sendMessage(message); setMessage(''); }}}
        />
        <button 
          className="btn btn-primary"
          onClick={() => { sendMessage(message); setMessage(''); }}>
          Send
        </button>
      </div>
    </div>
    
    </>
  );
}
