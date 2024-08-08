'use client';

import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../../context/SocketContextProvider";
import { useRouter } from "next/navigation";
import "./publicroomcss.css";
import { MessageInput } from "../../_components/MessageInput";
import { SuccessToast } from "../../_components/ChatToasts";
import ChatScreenHeader from "../../_components/ChatScreenHeader";
import ChatMessage from "../../_components/ChatBubble";
import useEnsureUser from "../../hooks/useEnsureUser";
import { useContextMenu } from "../../hooks/useContextMenu";
import ContextMenu from "../../_components/ContextMenu";

export default function PublicChat() {

  // Interface for toast notifications
  interface Toast {
    id: number;
    message: string;
  }

  // Router and socket context hook
  const router = useRouter();
  const { sendPublicMessage, allPublicMessages, username, newSocketNotiPublic } = useSocket();

  // State management
  const [message, setMessage] = useState('');
  const scrollToBottomRef = useRef<HTMLDivElement | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0); // Ref to keep track of toast IDs
  const { contextMenu, handleContextMenu, handleTouchStart, closeContextMenu } = useContextMenu();

  // Ensure user is logged in
  useEnsureUser(username);

  // Handle new user notifications
  useEffect(() => {
    if (newSocketNotiPublic) {
      addToast("New user joined the chat!");
    }
  }, [newSocketNotiPublic]);

  // Add a new toast notification
  const addToast = (message: string) => {
    const newToast = {
      id: toastIdRef.current++,
      message
    };
    setToasts(prev => [...prev, newToast]);
  };

  // Automatically remove toasts after 5 seconds
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts(prev => prev.slice(1));
      }, 1700);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  // Handle sending messages
  const handleSendMessage = async () => {
    sendPublicMessage(message);
    setMessage('');
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-black">
        <ChatScreenHeader headingText="Public Chat" />
        
        {/* Toast notifications container */}
        <div className="toast-container fixed top-4 left-4 z-50 flex flex-col gap-2">
          {toasts.map(toast => (
            <SuccessToast key={toast.id} notiText={toast.message} show={true} />
          ))}
        </div>
        
        {/* Chat messages container */}
        <div className="flex-1 p-4 no-scrollbar overflow-y-auto">
          {allPublicMessages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg}
              isOwn={msg.isOwn}
              timestamp={msg.timestamp}
              onContextMenu={handleContextMenu}
              onTouchStart={handleTouchStart}
            />
          ))}
          <div ref={scrollToBottomRef}></div> {/* Scroll to bottom reference */}
        </div>
        
        {/* Input field and send button */}
        <MessageInput
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
        />
        
        {/* Context menu component */}
        <ContextMenu
          contextMenu={contextMenu}
          closeContextMenu={closeContextMenu}
          setSentiment={(sentiment) => { addToast(sentiment); }} // Handle sentiment toast
          setSentimentToast={() => {}} // Not used on this page
        />
      </div>
    </>
  );
}
