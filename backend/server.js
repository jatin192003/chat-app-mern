import { Server } from "socket.io";
import app from "./app.js";

// Store online users as an array of objects containing both socket id and user id
let onlineUsers = [];

const server = app.listen(process.env.PORT, () => {
    console.log("server is listening at port", process.env.PORT);
})

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

// When a user connects
io.on("connection", (socket) => {
    console.log("Connected to socket.io", socket.id);

    socket.on("setup", (userData) => {
        // Add user to the online list with both socket.id and userData._id
        onlineUsers.push({ socketId: socket.id, userId: userData._id });
        console.log("User connected:", userData._id);

        // Emit online users to all clients
        io.emit("online-users", onlineUsers);

        // Send back the current list of online users to the new user
        socket.emit("online-users", onlineUsers);
    });

    // When a user disconnects
    socket.on("disconnect", () => {
        console.log("Disconnected from socket.io", socket.id);

        // Remove the user from the onlineUsers list using their socket.id
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
        console.log("Updated online users:", onlineUsers);

        // Emit updated online users list to all clients
        io.emit("online-users", onlineUsers);
    });
});
