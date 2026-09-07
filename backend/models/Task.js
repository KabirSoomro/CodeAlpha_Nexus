// I am importing the mongoose library to create the task schema.
const mongoose = require('mongoose');

// I am defining the task schema using Mongoose.
const taskSchema = new mongoose.Schema({
    // I am defining the projectId field to reference the Project model.
    projectId: {
        // I am setting the type to a MongoDB ObjectId.
        type: mongoose.Schema.Types.ObjectId,
        // I am specifying that this ObjectId references the 'Project' model.
        ref: 'Project',
        // I am making the projectId field mandatory.
        required: true
    // I am closing the projectId field definition.
    },
    // I am defining the title field as a required string.
    title: {
        // I am setting the type to String.
        type: String,
        // I am making the title field mandatory.
    // I am closing the title field definition.
    },
    // I am defining the description field as an optional string.
    description: {
        // I am setting the type to String.
        type: String
    // I am closing the description field definition.
    },
    // I am defining the status field with specific allowed values.
    status: {
        // I am setting the type to String.
        type: String,
        // I am specifying the enum values for task statuses.
        enum: ['To-Do', 'In Progress', 'Done'],
        // I am setting the default status to 'To-Do'.
        default: 'To-Do'
    // I am closing the status field definition.
    },
    // I am defining the priority field with an enum for allowed values.
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    // I am defining the assignedTo field to reference the User model.
    assignedTo: {
        // I am setting the type to a MongoDB ObjectId.
        type: mongoose.Schema.Types.ObjectId,
        // I am specifying that this ObjectId references the 'User' model.
        ref: 'User'
    // I am closing the assignedTo field definition.
    },
    // I am defining the dueDate field as an optional date.
    dueDate: {
        // I am setting the type to Date.
        type: Date
    // I am closing the dueDate field definition.
    }
// I am adding timestamps to automatically record createdAt and updatedAt fields.
}, { timestamps: true });

// I am creating the Task model from the schema.
const Task = mongoose.model('Task', taskSchema);

// I am exporting the Task model to use it in controllers.
module.exports = Task;
