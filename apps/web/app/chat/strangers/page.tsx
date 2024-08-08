"use client";

import { useState, useEffect, useRef } from "react";
import { useSocket } from "../../../context/SocketContextProvider";
import { useRouter } from "next/navigation";
import "./strangersroomcss.css";
import { InfoToast, ErrorToast, SuccessToast } from "../../_components/ChatToasts";
import ChatScreenHeader from "../../_components/ChatScreenHeader";
import ChatMessage from "../../_components/ChatBubble";
import { MessageInputStrangersRoom } from "../../_components/MessageInput";
import useEnsureUser from "../../hooks/useEnsureUser";
import usePreventBackNavigation from "../../hooks/usePreventBackNavigation";
import ContextMenu from "../../_components/ContextMenu";
import { useContextMenu } from "../../hooks/useContextMenu";

export default function MeetStrangersRoom({ params }: { params: { roomnumber: string } }) {
    // Router hook for navigation
    const router = useRouter();
    
    // Destructure necessary functions and state from the socket context
    const { sendRoomMessage, allRoomMessages, username, currentStrangerRoom, startChat, stopChat } = useSocket();

    // Ref to auto-scroll to the bottom of the chat window
    const scrollToBottomRef = useRef<HTMLDivElement | null>(null);
    
    // Local state for handling various aspects of the chat
    const [chatIsStopped, setChatIsStopped] = useState(true);
    const [message, setMessage] = useState('');
    const [searchingToast, setSearchingToast] = useState(false);
    const [userDisconnected, setUserDisconnected] = useState(false);
    const { contextMenu, handleContextMenu, handleTouchStart, closeContextMenu } = useContextMenu();
    const [sentiment, setSentiment] = useState<string>(""); // State for sentiment message
    const [sentimentToast, setSentimentToast] = useState(false); // State for sentiment toast visibility

    // Effect to scroll to the bottom of the chat window when new messages arrive
    useEffect(() => {
        if (scrollToBottomRef.current) {
            scrollToBottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [allRoomMessages]);

    // Custom hooks for user validation and preventing back navigation
    useEnsureUser(username);
    usePreventBackNavigation();

    // Effect to manage chat state based on whether it's stopped or not
    useEffect(() => {
        if (!chatIsStopped) {
            if (currentStrangerRoom === "stopped") {
                setUserDisconnected(true);
                setChatIsStopped(true);
            } else if (currentStrangerRoom === null) {
                setSearchingToast(true);
                setUserDisconnected(false);
            } else {
                setSearchingToast(false);
                setUserDisconnected(false);
            }
        } else {
            setSearchingToast(false);
        }
    }, [chatIsStopped, currentStrangerRoom]);

    // Function to handle sending messages
    const handleSendMessage = () => {
        if (currentStrangerRoom && message.trim()) {
            sendRoomMessage(currentStrangerRoom, message);
            setMessage('');
        }
    };

    // Function to start the chat session
    const handleStartChat = () => {
        setChatIsStopped(false);
        startChat();
    };

    // Function to stop the chat session
    const handleStopChat = () => {
        setChatIsStopped(true);
        setUserDisconnected(true);
        stopChat();
    };

    return (
        <>
            <div className="min-h-screen flex flex-col bg-black">

                {/* Header for the chat screen */}
                <ChatScreenHeader headingText="Strangers Room" />
                
                {/* Toast notifications for chat status */}
                <SuccessToast notiText={sentiment} show={sentimentToast} />
                <InfoToast notiText="Searching for a user..." show={searchingToast} />
                <ErrorToast notiText="Chat Disconnected!" show={userDisconnected} />
                
                {/* Container for displaying chat messages */}
                <div className="flex-1 p-4 overflow-y-auto">
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
                    <div ref={scrollToBottomRef}></div>
                </div>

                {/* Input field and buttons for sending messages and managing chat state */}
                <MessageInputStrangersRoom
                    message={message}
                    setMessage={setMessage}
                    handleSendMessage={handleSendMessage}
                    handleStartChat={handleStartChat}
                    handleStopChat={handleStopChat}
                    chatIsStopped={chatIsStopped}
                    searchingToast={searchingToast}
                />

                {/* Context menu for additional chat options */}
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