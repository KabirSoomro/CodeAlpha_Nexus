// I am importing the express library to create the router.
const express = require('express');
// I am creating a new router instance.
const router = express.Router();
// I am importing the protect middleware to secure the routes.
const { protect } = require('../middleware/authMiddleware');
// I am importing the task controller functions.
const { createTask, getTasksByProject, updateTaskStatus, updateTask, deleteTask, clearCompletedTasks } = require('../controllers/taskController');

// I am applying the protect middleware to all routes in this router.
router.use(protect);

// I am defining a POST route to create a new task.
router.post('/', createTask);
// I am defining a GET route to retrieve all tasks for a specific project.
router.get('/project/:projectId', getTasksByProject);
// I am defining a PUT route to update a task's status (for drag-and-drop).
router.put('/:id/status', updateTaskStatus);
// I am defining a DELETE route to remove a task.
router.delete('/:id', deleteTask);
// I am defining a PUT route for full task updates.
router.put('/:id', updateTask);
// I am defining a DELETE route to clear completed tasks for a project.
router.delete('/project/:projectId/done', clearCompletedTasks);
// I am exporting the router to use it in server.js.
module.exports = router;
