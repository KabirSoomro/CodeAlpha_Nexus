// I am importing the mongoose library to interact with MongoDB.
const mongoose = require('mongoose');

let isConnecting = false;

// I am defining an asynchronous function to connect to the database.
const connectDB = async () => {
    // If already connected or currently attempting, do not spawn another attempt.
    if (mongoose.connection.readyState === 1 || isConnecting) {
        return;
    }

    isConnecting = true;
    try {
        // I am awaiting connection with a 5000ms selection timeout.
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.error('Atlas Tip: Ensure your current IP is whitelisted in MongoDB Atlas Network Access (or set to 0.0.0.0/0 to allow anywhere).');
    } finally {
        isConnecting = false;
    }
};

// I am setting up connection event listeners.
mongoose.connection.on('connected', () => {
    console.log('MongoDB connection active.');
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting reconnection...');
});

// Periodically attempt reconnection if disconnected so IP whitelist changes take effect automatically.
setInterval(() => {
    if (mongoose.connection.readyState === 0) {
        connectDB();
    }
}, 7000);

// I am exporting the connectDB function so it can be used in server.js.
module.exports = connectDB;

