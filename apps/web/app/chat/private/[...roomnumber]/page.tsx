"use client";

import { useState, useEffect, useRef } from "react";
import { useSocket } from "../../../../context/SocketContextProvider";
import { useRouter } from "next/navigation";
import { MessageInput } from "../../../_components/MessageInput";
import { SuccessToast, InfoToast } from "../../../_components/ChatToasts";
import ChatScreenHeader from "../../../_components/ChatScreenHeader";
import ChatMessage from "../../../_components/ChatBubble";
import ContextMenu from "../../../_components/ContextMenu";
import { useContextMenu } from "../../../hooks/useContextMenu";
import useEnsureUser from "../../../hooks/useEnsureUser";
import usePreventBackNavigation from "../../../hooks/usePreventBackNavigation";

export default function PersonalRoomChat({ params }: { params: { roomnumber: string } }) {

  // Initialize router and socket context
  const router = useRouter();
  const { sendRoomMessage, allRoomMessages, username, newSocketNotiRoom } = useSocket();

  // State to manage message input and notifications
  const [message, setMessage] = useState('');
  const currentRoom = params.roomnumber; // Current room number from params
  const [newUserToast, setNewUserToast] = useState(false); // State for new user notification
  const [sentiment, setSentiment] = useState<string>(""); // State for sentiment message
  const [sentimentToast, setSentimentToast] = useState(false); // State for sentiment toast visibility

  // Reference to manage scrolling to the bottom
  const scrollToBottomRef = useRef<HTMLDivElement | null>(null);

  // Context menu state and handlers
  const { contextMenu, handleContextMenu, handleTouchStart, closeContextMenu } = useContextMenu();

  // Custom Hooks
  useEnsureUser(username); // Ensure the user is logged in
  usePreventBackNavigation(); // Prevent navigating back to avoid joining multiple rooms

  // Effect to handle new user notifications
  useEffect(() => {
    if (newSocketNotiRoom) {
      setNewUserToast(true);
      const timer = setTimeout(() => {
          setNewUserToast(false);
      }, 3000); // Show toast for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [newSocketNotiRoom]);

  // Function to handle sending a message
  const handleSendMessage = async () => {
    sendRoomMessage(currentRoom, message); // Send message to the current room
    setMessage(''); // Clear message input
  };

  // Effect to scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    if (scrollToBottomRef.current) {
        scrollToBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allRoomMessages]);

  return (
    <>
      <div className="min-h-screen flex flex-col bg-black">
        <ChatScreenHeader headingText="Private Room" />
        
        {/* Display success toast for new user and sentiment */}
        <SuccessToast notiText="New user joined the chat!" show={newUserToast} />
        <SuccessToast notiText={sentiment} show={sentimentToast} />
        
        {/* Chat messages container */}
        <div className="flex-1 p-4 no-scrollbar overflow-y-auto">
          {allRoomMessages.map((msg, index) => (
              <ChatMessage
                  key={index}
                  message={msg}
                  isOwn={msg.isOwn}
                  timestamp={msg.timestamp}
                  onContextMenu={handleContextMenu}
                  onTouchStart={handleTouchStart}
              />
          ))}
          <div ref={scrollToBottomRef}></div> {/* Reference for scrolling to bottom */}
        </div>
        
        {/* Input field for sending messages */}
        <MessageInput
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
        />
        
        {/* Context menu for additional options */}
        <ContextMenu
          contextMenu={contextMenu}
          closeContextMenu={closeContextMenu}
          setSentiment={setSentiment} // Update sentiment state
          setSentimentToast={setSentimentToast} // Update sentiment toast visibility
        />
      </div>
    </>
  );
}