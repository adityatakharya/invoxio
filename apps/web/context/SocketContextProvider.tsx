"use client"

import { Socket } from "socket.io-client";
import React, { useCallback, useEffect, useContext, useState, useRef } from "react";
import { io, Socket as ServerSocket } from "socket.io-client";

interface SocketContextProviderProps {
    children?: React.ReactNode
}

interface ISocketContext {
    username: string
    sendMessage: (msg: string) => any
    joinRoom: (roomNumber: string) => void
    sendRoomMessage: (roomNumber: string, msg: string) => any
    setUsernameFunc: (username: string) => void
    allPublicMessages: {message: string, isOwn: boolean, username: string, timestamp: string}[]
    allRoomMessages: {message: string, isOwn: boolean, username: string, timestamp: string}[]
    newSocketNotiPublic: boolean;
    newSocketNotiRoom: boolean;
}

const SocketContext = React.createContext<ISocketContext | null>(null);
export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) throw new Error('State is Undefined')
    else return state;
}

export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({ children }) => {

    const [socket, setSocket] = useState<Socket>()
    const [allPublicMessages, setAllPublicMessages] = useState<{message: string, isOwn: boolean, username: string, timestamp: string}[]>([]);
    const [allRoomMessages, setAllRoomMessages] = useState<{message: string, isOwn: boolean, username: string, timestamp: string}[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const [username, setUsername] = useState("");
    const [newSocketNotiRoom, setNewSocketNotiRoom] = useState(false);
    const [newSocketNotiPublic, setNewSocketNotiPublic] = useState(false);

    const sendMessage: ISocketContext["sendMessage"] = useCallback((msg: string) => {
        console.log("Sending Message: ", msg);
        if (socket) {
            socket.emit('event:test-message', { message: msg })
        }
    }, [socket]);

    const joinRoom: ISocketContext["joinRoom"] = useCallback((roomNumber: string) => {
        if (socket) {
            socket.emit('event:join-room', { roomNumber });
        }
    }, [socket]);

    const sendRoomMessage: ISocketContext["sendRoomMessage"] = useCallback((roomNumber: string, msg: string) => {
        if (socket) {
            socket.emit('event:test-message', { message: msg, roomNumber });
        }
    }, [socket]);

    const onPublicMessageReceived = useCallback((msg: string) => {
        try {
            console.log("Public Message Recived");
            const { message, senderId, username, timestamp } = JSON.parse(msg) as { message: string, senderId: string, username: string, timestamp: string};
            const isOwn = senderId === socketRef.current?.id;
            setAllPublicMessages(prev => [...prev, {message, isOwn, username, timestamp}])
        }
        catch (error) {
            console.error("Error parsing room message:", error);
        }
    }, []);

    const onRoomMessageReceived = useCallback((msg: string) => {
        try {
            console.log("Room Message Recived");
            const { message, senderId, username, timestamp } = JSON.parse(msg) as { message: string, senderId: string, username: string, timestamp: string };
            const isOwn = senderId === socketRef.current?.id;
            setAllRoomMessages(prev => [...prev, {message, isOwn, username, timestamp}]);
        } catch (error) {
            console.error("Error parsing room message:", error);
        }
    }, []);

    const setUsernameFunc: ISocketContext["setUsernameFunc"] = useCallback((usernamereceived: string) => {
        //Setting Up Client Side
        setUsername(usernamereceived);
        console.log("username changed to: ", usernamereceived)
        //Setting Up Server Side (on Socket)
        if(socket){
            socket.emit("username-change-request", {usernamereceived});
        }
    }, [socket, setUsername]);

    const onNewSocketJoinRoom = useCallback(() => {
        setNewSocketNotiRoom(true);
        console.log("new user noti function working");
        
        const timerId = setTimeout(() => {
            setNewSocketNotiRoom(false);
        }, 7000);
    
        return () => clearTimeout(timerId);
    }, []);

    const onNewSocketJoinPublic = useCallback(() => {
        setNewSocketNotiPublic(true);
        console.log("new user noti function working");
        
        const timerId = setTimeout(() => {
            setNewSocketNotiPublic(false);
        }, 7000);
    
        return () => clearTimeout(timerId);
    }, []);

    useEffect(() => {
        const _socket = io("https://invoxio-deploy-production.up.railway.app", {
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
        

        return () => {
            _socket.disconnect();
            setSocket(undefined);
        }
    }, [])

    return (
        <SocketContext.Provider value={{ sendMessage, joinRoom, sendRoomMessage, allPublicMessages, allRoomMessages, username, setUsernameFunc, newSocketNotiRoom, newSocketNotiPublic }}>
            {children}
        </SocketContext.Provider>
    )
}
