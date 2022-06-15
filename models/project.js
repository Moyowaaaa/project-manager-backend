const mongoose = require('mongoose');
const client = require('./client');


const ProjectSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    description:{
        type:String,
    },
    status:{
        enum:['Not Started', 'In Progress', 'Completed'],
    },
    clientId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Client',
    }
})

module.exports = mongoose.model('Project',ProjectSchema);