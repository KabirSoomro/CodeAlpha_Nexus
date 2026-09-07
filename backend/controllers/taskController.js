// I am importing the Task model to interact with the tasks collection.
const Task = require('../models/Task');

// I am defining the createTask controller function.
const createTask = async (req, res) => {
    // I am starting a try-catch block to handle task creation errors.
    try {
        // I am extracting projectId, title, description, dueDate, and priority from the request body.
        const { projectId, title, description, dueDate, priority } = req.body;
        // I am creating a new task in the database.
        const task = await Task.create({
            // I am assigning the project ID.
            projectId,
            // I am assigning the task title.
            title,
            // I am assigning the task description.
            description,
            // I am assigning the due date if provided.
            dueDate,
            // I am assigning the priority.
            priority: priority || 'Medium',
            // I am setting the default assigned user to the creator for simplicity.
            assignedTo: req.user._id
        });
        // I am sending a 201 Created response with the new task.
        res.status(201).json(task);
    // I am catching any unexpected errors during creation.
    } catch (error) {
        // I am sending a 500 Server Error response.
        res.status(500).json({ message: error.message });
    // I am closing the try-catch block.
    }
// I am closing the createTask function.
};

// I am defining the getTasksByProject controller function.
const getTasksByProject = async (req, res) => {
    // I am starting a try-catch block to handle fetching errors.
    try {
        // I am extracting the projectId from the request parameters.
        const { projectId } = req.params;
        // I am finding all tasks that belong to the specified project.
        const tasks = await Task.find({ projectId });
        // I am sending a 200 OK response with the array of tasks.
        res.json(tasks);
    // I am catching any unexpected errors during fetch.
    } catch (error) {
        // I am sending a 500 Server Error response.
        res.status(500).json({ message: error.message });
    // I am closing the try-catch block.
    }
// I am closing the getTasksByProject function.
};

// I am defining the updateTaskStatus controller function for drag-and-drop.
const updateTaskStatus = async (req, res) => {
    // I am starting a try-catch block to handle update errors.
    try {
        // I am extracting the task ID from the request parameters.
        const { id } = req.params;
        // I am extracting the new status from the request body.
        const { status } = req.body;
        
        // I am updating the task in the database and returning the updated document.
        const updatedTask = await Task.findByIdAndUpdate(
            // I am passing the task ID to find it.
            id,
            // I am passing the new status to update.
            { status },
            // I am setting new to true to return the updated document.
            { new: true }
        );

        // I am checking if the task was not found.
        if (!updatedTask) {
            // I am sending a 404 Not Found response.
            return res.status(404).json({ message: 'Task not found' });
        // I am closing the if statement.
        }

        // I am sending a 200 OK response with the updated task.
        res.json(updatedTask);
    // I am catching any unexpected errors during update.
    } catch (error) {
        // I am sending a 500 Server Error response.
        res.status(500).json({ message: error.message });
    // I am closing the try-catch block.
    }
// I am closing the updateTaskStatus function.
};

// I am defining the deleteTask controller function.
const deleteTask = async (req, res) => {
    // I am starting a try-catch block to handle deletion errors.
    try {
        // I am extracting the task ID from the request parameters.
        const { id } = req.params;
        // I am finding and deleting the task from the database.
        const deletedTask = await Task.findByIdAndDelete(id);
        
        // I am checking if the task was not found.
        if (!deletedTask) {
            // I am sending a 404 Not Found response.
            return res.status(404).json({ message: 'Task not found' });
        // I am closing the if statement.
        }

        // I am sending a 200 OK response with a success message.
        res.json({ message: 'Task removed' });
    // I am catching any unexpected errors during deletion.
    } catch (error) {
        // I am sending a 500 Server Error response.
        res.status(500).json({ message: error.message });
    // I am closing the try-catch block.
    }
// I am closing the deleteTask function.
};

// I am defining the updateTask controller function for full updates.
const updateTask = async (req, res) => {
    // I am starting a try-catch block to handle update errors.
    try {
        // I am extracting the task ID.
        const { id } = req.params;
        // I am extracting the new data.
        const { title, description, priority, dueDate } = req.body;
        
        // I am updating the task in the database.
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, priority, dueDate },
            { new: true }
        );

        // I am checking if task exists.
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // I am sending updated task.
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
// I am closing the updateTask function.
};

// I am defining the clearCompletedTasks function.
const clearCompletedTasks = async (req, res) => {
    // I am starting a try-catch block.
    try {
        // I am getting the project ID.
        const { projectId } = req.params;
        
        // I am deleting all tasks where status is Done and projectId matches.
        const result = await Task.deleteMany({ projectId, status: 'Done' });
        
        // I am returning the success response.
        res.json({ message: 'Completed tasks cleared', count: result.deletedCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
// I am closing the clearCompletedTasks function.
};

// I am exporting the controller functions for use in routes.
module.exports = { createTask, getTasksByProject, updateTaskStatus, updateTask, deleteTask, clearCompletedTasks };
