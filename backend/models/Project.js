// I am importing the mongoose library to create the project schema.
const mongoose = require('mongoose');

// I am defining the project schema using Mongoose.
const projectSchema = new mongoose.Schema({
    // I am defining the name field as a required string.
    name: {
        // I am setting the type to String.
        type: String,
        // I am making the name field mandatory.
        required: true
    // I am closing the name field definition.
    },
    // I am defining the description field as a required string.
    description: {
        // I am setting the type to String.
        type: String,
        // I am making the description field mandatory.
        required: true
    // I am closing the description field definition.
    },
    // I am defining the ownerId field to reference the User model.
    ownerId: {
        // I am setting the type to a MongoDB ObjectId.
        type: mongoose.Schema.Types.ObjectId,
        // I am specifying that this ObjectId references the 'User' model.
        ref: 'User',
        // I am making the ownerId field mandatory.
        required: true
    // I am closing the ownerId field definition.
    },
    // I am defining the members field as an array of ObjectIds referencing the User model.
    members: [{
        // I am setting the type of each array element to a MongoDB ObjectId.
        type: mongoose.Schema.Types.ObjectId,
        // I am specifying that these ObjectIds reference the 'User' model.
        ref: 'User'
    // I am closing the members array definition.
    }]
// I am adding timestamps to automatically record createdAt and updatedAt fields.
}, { timestamps: true });

// I am creating the Project model from the schema.
const Project = mongoose.model('Project', projectSchema);

// I am exporting the Project model to use it in controllers.
module.exports = Project;
