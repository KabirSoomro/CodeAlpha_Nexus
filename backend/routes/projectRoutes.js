// I am importing the express library to create the router.
const express = require('express');
// I am creating a new router instance.
const router = express.Router();
// I am importing the protect middleware to secure the routes.
const { protect } = require('../middleware/authMiddleware');
// I am importing the project controller functions.
const { createProject, getProjects, deleteProject } = require('../controllers/projectController');

// I am applying the protect middleware to all routes in this router.
router.use(protect);

// I am defining a POST route to create a new project.
router.post('/', createProject);
// I am defining a GET route to retrieve all projects for the user.
router.get('/', getProjects);
// I am defining a DELETE route to remove a project.
router.delete('/:id', deleteProject);

// I am exporting the router to use it in server.js.
module.exports = router;
