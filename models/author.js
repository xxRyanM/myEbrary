const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// pre command before removing an author
authorSchema.pre('remove', function (next) {
    Book.find({ author: this.id }, (err, books) => {
        if (err) {
            next(err)
            console.log(err)
        } else if (books.length > 0) {
            next(new Error('This author has books still'))
        } else {
            next()
        }
    })
})

// making the router global or accessable 
module.exports = mongoose.model('Author', authorSchema)