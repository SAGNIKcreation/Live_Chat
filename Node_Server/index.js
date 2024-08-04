// Run this file by "nodemon index.js"


const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5500", // Adjust this to match your client origin
        methods: ["GET", "POST"]
    }
});

// Use the CORS middleware
app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
    credentials: true
}));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Array for users of the chat system
const users = {};

// When someone new joins chat, let others know it
io.on('connection', socket => {
    console.log('New connection:', socket.id);

    socket.on('new-user-joined', Name => {
        users[socket.id] = Name;
        console.log('User joined:', Name);
        socket.broadcast.emit('user-joined', Name);
    });

    // When someone sends a message, broadcast to others
    socket.on('send', message => {
        console.log('Message sent:', message);
        io.emit('receive', { message: message, Name: users[socket.id] });
    });

    // When someone leaves the chat, let others know
    socket.on('disconnect', () => {
        console.log('User disconnected:', users[socket.id]);
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

// Starting the server
server.listen(8000, () => {
    console.log('Listening on port 8000');
});
