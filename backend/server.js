// I am importing the express library to create the web server.
const express = require('express');
// I am importing the http module to create a server compatible with socket.io.
const http = require('http');
// I am importing the Server class from socket.io for real-time communication.
const { Server } = require('socket.io');
// I am importing the mongoose library to interact with MongoDB.
const mongoose = require('mongoose');
// I am importing the cors middleware to allow cross-origin requests.
const cors = require('cors');
// I am importing dotenv to load environment variables from the .env file.
require('dotenv').config();

// I am importing the database connection function.
const connectDB = require('./config/db');
// I am importing the auth routes.
const authRoutes = require('./routes/authRoutes');
// I am importing the project routes.
const projectRoutes = require('./routes/projectRoutes');
// I am importing the task routes.
const taskRoutes = require('./routes/taskRoutes');

// I am calling the connectDB function to connect to MongoDB.
connectDB();

// I am creating an express application instance.
const app = express();
// I am creating an HTTP server wrapping the express app.
const server = http.createServer(app);
// I am initializing a new socket.io server instance attached to the HTTP server.
const io = new Server(server, {
    // I am configuring CORS for socket.io to allow all origins.
    cors: {
        // I am allowing any origin to connect to prevent CORS blocking between Vercel and Render.
        origin: '*',
        // I am allowing standard real-time HTTP methods.
        methods: ['GET', 'POST']
    // I am closing the cors configuration object.
    }
// I am closing the Server instantiation.
});

// I am applying the cors middleware to the express app to permit cross-origin requests from any client.
app.use(cors({
    // I am permitting requests from any origin to prevent CORS blocking between frontend and backend hosts.
    origin: '*',
    // I am permitting standard RESTful HTTP methods.
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    // I am allowing essential request headers including authentication tokens.
    allowedHeaders: ['Content-Type', 'Authorization']
// I am closing the cors middleware configuration.
}));
// I am applying the express.json middleware to parse JSON request bodies.
app.use(express.json());
// I am importing the path module to resolve file paths safely.
const path = require('path');
// I am serving static files from the frontend directory using path.join.
app.use(express.static(path.join(__dirname, '../frontend')));

// I am mounting the auth routes at /api/auth.
app.use('/api/auth', authRoutes);
// I am mounting the project routes at /api/projects.
app.use('/api/projects', projectRoutes);
// I am mounting the task routes at /api/tasks.
app.use('/api/tasks', taskRoutes);

// I am setting up an event listener for new socket connections.
io.on('connection', (socket) => {
    // I am logging a message when a new client connects with their socket ID.
    console.log(`New client connected: ${socket.id}`);

    // I am listening for a 'joinProject' event from the client.
    socket.on('joinProject', (projectId) => {
        // I am making the socket join a specific room named after the projectId.
        socket.join(projectId);
        // I am logging that the client joined the room.
        console.log(`Client ${socket.id} joined project room: ${projectId}`);
    // I am closing the joinProject listener.
    });

    // I am listening for a 'taskMoved' event when a user drags and drops a task.
    socket.on('taskMoved', (data) => {
        // I am extracting projectId, taskId, and newStatus from the event data.
        const { projectId, taskId, newStatus } = data;
        // I am broadcasting the 'taskUpdated' event to all other clients in the project room.
        socket.to(projectId).emit('taskUpdated', { taskId, newStatus });
    // I am closing the taskMoved listener.
    });

    // I am setting up an event listener for client disconnections.
    socket.on('disconnect', () => {
        // I am logging a message when a client disconnects.
        console.log(`Client disconnected: ${socket.id}`);
    // I am closing the disconnect listener.
    });
// I am closing the connection listener.
});

// I am defining the port from environment variables or defaulting to 5000.
const PORT = process.env.PORT || 5000;

// I am starting the HTTP server on the specified port.
server.listen(PORT, () => {
    // I am logging a message indicating the server is running.
    console.log(`Server running on port ${PORT}`);
// I am closing the listen callback.
});
