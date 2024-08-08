"use client"

import { Socket } from "socket.io-client";
import React, { useCallback, useEffect, useContext, useState, useRef } from "react";
import { io, Socket as ServerSocket } from "socket.io-client";

// Props interface for SocketContextProvider
interface SocketContextProviderProps {
    children?: React.ReactNode
}

// Interface defining the structure of the SocketContext
interface ISocketContext {
    username: string
    sendPublicMessage: (msg: string) => any
    joinRoom: (roomNumber: string) => void
    sendRoomMessage: (roomNumber: string, msg: string) => any
    setUsernameFunc: (username: string) => void
    allPublicMessages: { message: string, isOwn: boolean, username: string, timestamp: string }[]
    allRoomMessages: { message: string, isOwn: boolean, username: string, timestamp: string }[]
    newSocketNotiPublic: boolean;
    newSocketNotiRoom: boolean;
    currentStrangerRoom: string | null;
    startChat: () => void;
    stopChat: () => void;
}

// Create a context for socket management
const SocketContext = React.createContext<ISocketContext | null>(null);

// Custom hook to access the SocketContext
export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) throw new Error('SocketContext is not available');
    return state;
}

// Context provider component
export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({ children }) => {

    const [socket, setSocket] = useState<Socket>();
    const [allPublicMessages, setAllPublicMessages] = useState<{ message: string, isOwn: boolean, username: string, timestamp: string }[]>([]);
    const [allRoomMessages, setAllRoomMessages] = useState<{ message: string, isOwn: boolean, username: string, timestamp: string }[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const [username, setUsername] = useState("");
    const [newSocketNotiRoom, setNewSocketNotiRoom] = useState(false);
    const [newSocketNotiPublic, setNewSocketNotiPublic] = useState(false);
    const [currentStrangerRoom, setCurrentStrangerRoom] = useState<string | null>(null);

    // Function to send a public message
    const sendPublicMessage: ISocketContext["sendPublicMessage"] = useCallback((msg: string) => {
        if (socket) {
            socket.emit('event:test-message', { message: msg });
        }
    }, [socket]);

    // Function to join a room
    const joinRoom: ISocketContext["joinRoom"] = useCallback((roomNumber: string) => {
        if (socket) {
            socket.emit('event:join-room', { roomNumber });
        }
    }, [socket]);

    // Function to send a room message
    const sendRoomMessage: ISocketContext["sendRoomMessage"] = useCallback((roomNumber: string, msg: string) => {
        if (socket) {
            socket.emit('event:test-message', { message: msg, roomNumber });
        }
    }, [socket]);

    // Handler for receiving public messages
    const onPublicMessageReceived = useCallback((msg: string) => {
        try {
            const { message, senderId, username, timestamp } = JSON.parse(msg) as { message: string, senderId: string, username: string, timestamp: string };
            const isOwn = senderId === socketRef.current?.id;
            setAllPublicMessages(prev => [...prev, { message, isOwn, username, timestamp }]);
        } catch (error) {
            console.error("Error parsing public message:", error);
        }
    }, []);

    // Handler for receiving room messages
    const onRoomMessageReceived = useCallback((msg: string) => {
        try {
            const { message, senderId, username, timestamp } = JSON.parse(msg) as { message: string, senderId: string, username: string, timestamp: string };
            const isOwn = senderId === socketRef.current?.id;
            setAllRoomMessages(prev => [...prev, { message, isOwn, username, timestamp }]);
        } catch (error) {
            console.error("Error parsing room message:", error);
        }
    }, []);

    // Function to update the username
    const setUsernameFunc: ISocketContext["setUsernameFunc"] = useCallback((usernamereceived: string) => {
        setUsername(usernamereceived);
        console.log("Username changed to:", usernamereceived);
        if (socket) {
            socket.emit("username-change-request", { usernamereceived });
        }
    }, [socket]);

    // Notification handler for new socket joining a room
    const onNewSocketJoinRoom = useCallback(() => {
        setNewSocketNotiRoom(true);
        const timerId = setTimeout(() => {
            setNewSocketNotiRoom(false);
        }, 7000);
        return () => clearTimeout(timerId);
    }, []);

    // Notification handler for new socket joining public
    const onNewSocketJoinPublic = useCallback(() => {
        setNewSocketNotiPublic(true);
        const timerId = setTimeout(() => {
            setNewSocketNotiPublic(false);
        }, 7000);
        return () => clearTimeout(timerId);
    }, []);

    // Function to start a chat
    const startChat = useCallback(() => {
        if (socket) {
            socket.emit('event:start-chat');
        }
    }, [socket]);

    // Function to stop a chat
    const onChatStop = useCallback(() => {
        setCurrentStrangerRoom("stopped");
        setTimeout(() => stopChat(), 200);
    }, [socket]);

    // Function to end the chat and clear messages
    const stopChat = useCallback(() => {
        const roomToStop = currentStrangerRoom;
        socket?.emit('event:stop-chat', { roomToStop });
        setAllRoomMessages([]);
        setAllPublicMessages([]);
        setCurrentStrangerRoom(null);
    }, [socket, currentStrangerRoom, onChatStop]);

    // Handler for starting a chat
    const onChatStart = useCallback(({ room }: { room: string }) => {
        setCurrentStrangerRoom(room);
    }, [socket, currentStrangerRoom]);

    // Set up socket connection and periodic server ping
    useEffect(() => {
        // Function to ping the sentiment analysis server
        const pingPyServer = () => {
            fetch('https://invoxio-sentiment-analyzer.onrender.com/')
                .catch(error => console.error("Failed to ping sentiment analysis server:", error));
        };
        pingPyServer();  // Initial ping
        const intervalId = setInterval(pingPyServer, 780000);  // Ping every 13 minutes

        // Initialize socket connection
        const _socket = io("https://invoxio-deploy-production.up.railway.app/", {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });
        setSocket(_socket);
        socketRef.current = _socket;
        socketRef.current.on("event:sub-message-forall", onPublicMessageReceived);
        socketRef.current.on("event:sub-message-forroom", onRoomMessageReceived);
        socketRef.current.on("event:new-socket-joined-room", onNewSocketJoinRoom);
        socketRef.current.on("event:new-socket-joined-public", onNewSocketJoinPublic);
        socketRef.current.on("event:chat-started", onChatStart);
        socketRef.current.on("event:other-user-disconnected", onChatStop);

        // Clean up socket connection and interval on component unmount
        return () => {
            clearInterval(intervalId);
            _socket.disconnect();
            setSocket(undefined);
        };
    }, []);

    // Provide context value to child components
    return (
        <SocketContext.Provider value={{ sendPublicMessage, joinRoom, sendRoomMessage, allPublicMessages, allRoomMessages, username, setUsernameFunc, newSocketNotiRoom, newSocketNotiPublic, currentStrangerRoom, startChat, stopChat }}>
            {children}
        </SocketContext.Provider>
    );
}