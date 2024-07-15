import { Server as SocketIoServer } from "socket.io";
import Message from "./models/MessagesModel.js";
import cors from "cors";


const setupSocket = (server) => {
    const io = new SocketIoServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            credentials: true
        }
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };
    const sendMessage = async (message) => {
        console.log(message);
        try {
            const senderSocketId = userSocketMap.get(message.sender)
            const recipientSocketId = userSocketMap.get(message.recipient);

            // store messages recipient or sender offline/online
            const createMessage = await Message.create(message);

            //  
            const messageData = await Message.findById(createMessage._id)
                .populate("sender", "id email firstName lastName image color")
                .populate("recipient", "id email firstName lastName image color")
                if (recipientSocketId) {
                    console.log(`Emitting receiveMessage event to recipient: ${recipientSocketId}`);
                    io.to(recipientSocketId).emit("receiveMessage", messageData);
                }
                
                if (senderSocketId) {
                    console.log(`Emitting receiveMessage event to sender: ${senderSocketId}`);
                    io.to(senderSocketId).emit("receiveMessage", messageData);
                }
                
        } catch(err){
            console.error('Error in sendMessage:', err);
        }
    }

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} with socketId ${socket.id}`);
        } else {
            console.log("UserId not provided during connection");
        }
        socket.on("sendMessage", sendMessage)
        socket.on("disconnect", () => disconnect(socket));
    });

    return io;
};

export default setupSocket;
