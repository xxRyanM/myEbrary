const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// making the router global or accessable 
module.exports = mongoose.model('Author', authorSchema)