// I am importing the Project model to interact with the projects collection.
const Project = require('../models/Project');

// I am defining the createProject controller function.
const createProject = async (req, res) => {
    // I am starting a try-catch block to handle project creation errors.
    try {
        // I am extracting name and description from the request body.
        const { name, description } = req.body;
        // I am creating a new project with the logged-in user as the owner.
        const project = await Project.create({
            // I am assigning the project name.
            name,
            // I am assigning the project description.
            description,
            // I am assigning the owner ID from the authenticated user.
            ownerId: req.user._id,
            // I am adding the owner to the members array by default.
            members: [req.user._id]
        });
        // I am sending a 201 Created response with the new project.
        res.status(201).json(project);
    // I am catching any unexpected errors during creation.
    } catch (error) {
        // I am sending a 500 Server Error response.
        res.status(500).json({ message: error.message });
    // I am closing the try-catch block.
    }
// I am closing the createProject function.
};

// I am defining the getProjects controller function.
const getProjects = async (req, res) => {
    // I am starting a try-catch block to handle fetching errors.
    try {
        // I am finding all projects where the logged-in user is a member.
        const projects = await Project.find({ members: req.user._id });
        // I am sending a 200 OK response with the array of projects.
        res.json(projects);
    // I am catching any unexpected errors during fetch.
    } catch (error) {
        // I am sending a 500 Server Error response.
        res.status(500).json({ message: error.message });
    // I am closing the try-catch block.
    }
// I am closing the getProjects function.
};

// I am defining the deleteProject controller function.
const deleteProject = async (req, res) => {
    // I am starting a try-catch block to handle deletion errors.
    try {
        // I am extracting the project ID from the request parameters.
        const { id } = req.params;
        
        // I am finding the project by ID.
        const project = await Project.findById(id);
        
        // I am checking if the project was not found.
        if (!project) {
            // I am sending a 404 Not Found response.
            return res.status(404).json({ message: 'Project not found' });
        // I am closing the if statement.
        }

        // I am checking if the user requesting deletion is the owner of the project.
        if (project.ownerId.toString() !== req.user._id.toString()) {
            // I am sending a 403 Forbidden response if not authorized.
            return res.status(403).json({ message: 'Not authorized to delete this project' });
        // I am closing the if statement.
        }

        // I am deleting the project from the database.
        await Project.findByIdAndDelete(id);

        // I am also deleting all tasks associated with this project.
        const Task = require('../models/Task');
        await Task.deleteMany({ projectId: id });

        // I am sending a 200 OK response with a success message.
        res.json({ message: 'Project and associated tasks removed' });
    // I am catching any unexpected errors during deletion.
    } catch (error) {
        // I am sending a 500 Server Error response.
        res.status(500).json({ message: error.message });
    // I am closing the try-catch block.
    }
// I am closing the deleteProject function.
};

// I am exporting the controller functions for use in routes.
module.exports = { createProject, getProjects, deleteProject };
