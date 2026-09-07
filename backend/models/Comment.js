// I am importing the mongoose library to create the comment schema.
const mongoose = require('mongoose');

// I am defining the comment schema using Mongoose.
const commentSchema = new mongoose.Schema({
    // I am defining the taskId field to reference the Task model.
    taskId: {
        // I am setting the type to a MongoDB ObjectId.
        type: mongoose.Schema.Types.ObjectId,
        // I am specifying that this ObjectId references the 'Task' model.
        ref: 'Task',
        // I am making the taskId field mandatory.
        required: true
    // I am closing the taskId field definition.
    },
    // I am defining the userId field to reference the User model.
    userId: {
        // I am setting the type to a MongoDB ObjectId.
        type: mongoose.Schema.Types.ObjectId,
        // I am specifying that this ObjectId references the 'User' model.
        ref: 'User',
        // I am making the userId field mandatory.
        required: true
    // I am closing the userId field definition.
    },
    // I am defining the text field as a required string for the comment content.
    text: {
        // I am setting the type to String.
        type: String,
        // I am making the text field mandatory.
        required: true
    // I am closing the text field definition.
    }
// I am adding timestamps to automatically record the timestamp of the comment (createdAt).
}, { timestamps: true });

// I am creating the Comment model from the schema.
const Comment = mongoose.model('Comment', commentSchema);

// I am exporting the Comment model to use it in controllers.
module.exports = Comment;
