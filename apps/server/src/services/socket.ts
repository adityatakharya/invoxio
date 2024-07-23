import { Server, Socket as ServerSocket } from "socket.io";
import { Redis } from "ioredis";
import prismaClient from "./prisma";
import { produceMessage } from "./kafka";
import dotenv from "dotenv";

dotenv.config();

// Extend ServerSocket to include username
interface CustomSocket extends ServerSocket {
  username?: string;
}

const pub = new Redis({
    host: process.env.REDIS_HOST as string,
    username: process.env.REDIS_USERNAME as string,
    port: parseInt(process.env.REDIS_PORT || '20286', 10),
    tls: {
        host: process.env.REDIS_HOST as string,
    },
    password: process.env.REDIS_PASSWORD as string,
});

const sub = new Redis({
    host: process.env.REDIS_HOST as string,
    username: process.env.REDIS_USERNAME as string,
    port: parseInt(process.env.REDIS_PORT || '20286', 10),
    tls: {
        host: process.env.REDIS_HOST as string,
    },
    password: process.env.REDIS_PASSWORD as string,
});

class SocketService {
    private _io: Server;

    constructor() {
        console.log("Initializing Socket Service...");
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            }
        });

        sub.subscribe("PUBLICMSG");
    }

    public initListeners() {
        const io = this._io;
        console.log("Initializing Socket Listeners...");
        io.on("connect", (socket: CustomSocket) => {
            console.log("New Socket Connected: ", socket.id);
            socket.on('event:test-message', async ({ message, roomNumber }: { message: string, roomNumber?: string }) => {
                console.log("New Message Received: ", message);
                const senderId = socket.id;
                const username = socket.username || "Anonymous";
                const timestamp = new Date().toISOString();

                if (roomNumber) {
                    console.log("PUB IN PROGRESS")
                    await pub.publish(roomNumber, JSON.stringify({ message, senderId, username, timestamp }));
                } else {
                    console.log("PUB IN PROGRESS")
                    await pub.publish("PUBLICMSG", JSON.stringify({ message, senderId, username, timestamp }));
                }
            });

            socket.on('event:join-room', ({ roomNumber }: { roomNumber: string }) => {
                socket.join(roomNumber);
                console.log(`Socket ${socket.id} joined room ${roomNumber}`);
                io.to(roomNumber).emit("event:new-socket-joined-room", "New Socket Joined");
                sub.subscribe(roomNumber);
            });

            socket.on("username-change-request", ({usernamereceived}: {usernamereceived: string}) => {
                sub.subscribe("PUBLICMSG");
                console.log("new username received", usernamereceived);
                socket.username = usernamereceived;
                console.log(`Socket ${socket.id} set username to ${usernamereceived}`);
                io.emit("event:new-socket-joined-public", usernamereceived);
            });

            socket.on('disconnect', (reason) => {
                console.log('user disconnected:', socket.id, reason);
            });
        });

        sub.on("message", async (channel, message) => {
            console.log("SUB IN PROGRESS", message);
            if (channel === "PUBLICMSG") {
                console.log("Emitting message to Public Room...: ", message);
                io.emit("event:sub-message-forall", message);
                await produceMessage(message, channel);
            } else {
                console.log("Emitting message to Private Room - ", channel,"...: ", message);
                io.to(channel).emit("event:sub-message-forroom", message);
                await produceMessage(message, channel);
            }

            console.log("Produced Message to Kafka Broker as well");
        });
    }

    get io() {
        return this._io;
    }
}

export default SocketService;
