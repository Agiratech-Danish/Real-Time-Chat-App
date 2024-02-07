const express = require('express');
const socketIO = require('socket.io');

// APPLICATION SETUP.....

const PORT = 3000;
const app = express();
const server = app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

const io = socketIO(server); // To attach http to socket

let activeUsers = new Set();

io.on("connection", (socket) => {
    console.log("User socket connection!!!");

    socket.on("new user", (data) => {
        socket.userId = data;
        activeUsers.add(data);
        io.emit("new user", [...activeUsers]);
    });

    socket.on("chat message", (data) => {
        io.emit("chat message", data);
    });

    socket.on("disconnect", () => {
        activeUsers.delete(socket.userId);
        io.emit("user disconnected", socket.userId);
    });

    socket.on("typing", function (data) {
        socket.broadcast.emit("typing", data)
    })
});

// STATIC FILES (For HTML and CSS)
app.use(express.static("public"));
