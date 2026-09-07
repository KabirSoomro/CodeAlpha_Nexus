// I am declaring a variable to hold the socket connection instance.
let socket;

// I am defining a function to initialize the socket connection.
function initSocket() {
    // I am connecting to the socket.io server at the root URL.
    socket = io('http://localhost:5000');

    // I am listening for the 'connect' event to confirm successful connection.
    socket.on('connect', () => {
        // I am logging a success message with the socket ID.
        console.log(`Connected to Socket.io server with ID: ${socket.id}`);
    // I am closing the connect listener.
    });

    // I am listening for 'taskUpdated' events broadcasted by the server.
    socket.on('taskUpdated', (data) => {
        // I am extracting the taskId and newStatus from the event data.
        const { taskId, newStatus } = data;
        // I am logging the received update to the console.
        console.log(`Task ${taskId} moved to ${newStatus} by another user.`);
        
        // I am calling a global function (defined in board.js) to move the card in the UI.
        // I am checking if the function exists before calling it to avoid errors.
        if (typeof moveTaskCardInUI === 'function') {
            // I am passing the task ID and the new status to update the UI.
            moveTaskCardInUI(taskId, newStatus);
        // I am closing the if statement.
        }
    // I am closing the taskUpdated listener.
    });
// I am closing the initSocket function.
}

// I am defining a function to join a specific project room for real-time updates.
function joinProjectRoom(projectId) {
    // I am checking if the socket is initialized.
    if (socket) {
        // I am emitting a 'joinProject' event with the project ID to the server.
        socket.emit('joinProject', projectId);
    // I am closing the if statement.
    }
// I am closing the joinProjectRoom function.
}

// I am defining a function to emit an event when a task is moved locally.
function emitTaskMoved(projectId, taskId, newStatus) {
    // I am checking if the socket is initialized.
    if (socket) {
        // I am emitting the 'taskMoved' event with the required data to the server.
        socket.emit('taskMoved', { projectId, taskId, newStatus });
    // I am closing the if statement.
    }
// I am closing the emitTaskMoved function.
}

// I am adding an event listener to initialize the socket when the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    // I am checking if the io object (from the CDN script) is available.
    if (typeof io !== 'undefined') {
        // I am calling the initialization function.
        initSocket();
    // I am closing the if statement.
    }
// I am closing the DOMContentLoaded listener.
});
