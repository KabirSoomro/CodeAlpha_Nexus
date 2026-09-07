// I am importing the mongoose library to interact with MongoDB Atlas.
const mongoose = require('mongoose');

// I am tracking whether a database connection attempt is currently in progress.
let isConnecting = false;

// I am defining an asynchronous function to connect to the MongoDB Atlas database.
const connectDB = async () => {
    // I am checking if Mongoose is already connected or currently attempting to connect.
    if (mongoose.connection.readyState === 1 || isConnecting) {
        // I am returning early to prevent concurrent duplicate connection attempts.
        return;
    // I am closing the connection readiness check.
    }

    // I am strictly checking that process.env.MONGO_URI is set before attempting connection.
    if (!process.env.MONGO_URI) {
        // I am logging a critical error if the MongoDB URI environment variable is missing.
        console.error('CRITICAL DATABASE ERROR: process.env.MONGO_URI is not defined. Please set MONGO_URI in your environment variables.');
        // I am returning early because the database cannot be reached without a connection string.
        return;
    // I am closing the environment variable validation check.
    }

    // I am setting the connecting status flag to true.
    isConnecting = true;
    // I am starting a try-catch block to handle database connection errors safely.
    try {
        // I am connecting to MongoDB Atlas strictly using the URI loaded from process.env.MONGO_URI.
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // I am configuring a 5000 millisecond server selection timeout to avoid long hangs.
            serverSelectionTimeoutMS: 5000
        // I am closing the connection options object.
        });
        // I am logging the hostname of the connected MongoDB Atlas cluster to verify connection.
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    // I am catching any connection failure that occurs during the attempt.
    } catch (error) {
        // I am logging the database connection error message.
        console.error(`MongoDB Connection Error: ${error.message}`);
        // I am providing instructions on ensuring Atlas network whitelist configuration.
        console.error('Atlas Tip: Ensure your IP (or 0.0.0.0/0) is whitelisted in MongoDB Atlas Network Access.');
    // I am executing the finally block to reset the connection status flag.
    } finally {
        // I am resetting the connecting status flag once the attempt completes.
        isConnecting = false;
    // I am closing the finally block.
    }
// I am closing the connectDB function definition.
};

// I am setting up an event listener for when the database connection is active.
mongoose.connection.on('connected', () => {
    // I am logging a confirmation message that the connection is active.
    console.log('MongoDB connection active.');
// I am closing the connected event callback.
});

// I am setting up an event listener for when the database connection drops.
mongoose.connection.on('disconnected', () => {
    // I am logging a notification that the connection was dropped.
    console.log('MongoDB disconnected. Attempting reconnection...');
// I am closing the disconnected event callback.
});

// I am setting up a recurring interval to automatically re-attempt connection if disconnected.
setInterval(() => {
    // I am checking if the connection state is currently disconnected.
    if (mongoose.connection.readyState === 0) {
        // I am invoking the connectDB function to reconnect.
        connectDB();
    // I am closing the state check.
    }
// I am running this reconnection check every 7000 milliseconds.
}, 7000);

// I am exporting the connectDB function for consumption by server.js.
module.exports = connectDB;


