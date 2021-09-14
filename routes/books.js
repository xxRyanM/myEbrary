const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path') // built in node.js library
const fs = require('fs') // built in node.js library
const Book = require('../models/book')
const Author = require('../models/author')
const { config } = require('dotenv')

const uploadPath = path.join('public', Book.coverImageBasePath) // book models folder
const imageMimeTypes = ['image/jpg', 'image/png', 'image/gif', 'image/jpeg'] // default images filanames
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// All Books Route
router.get('/', async (req, res) => {
    // Query/Search Command
    let query = Book.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i')) // append the filter field to Book.find
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore) // append the filter field to Book.find
        
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter) // append the filter field to Book.find
    }
    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Book Route
router.get('/new', async (req, res) => {
   renderNewPage(res, new Book())
})

// Create Book Route
router.post('/', upload.single('cover'), async (req, res) => {
  
    let fileName = ''
    if (req.file != null) {
        fileName = req.file.filename
    } else {
        fileName = null
    }

    // if else function in shortcut
    // const fileName = req.file != null ? req.file.filename : null

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate), // convert to date from string date
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })

    try {
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect('books')
    } catch {
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
    }
})

function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = 'Error Creating Book *only jpg & png are allowed images* '
        res.render('books/new', params)
    } catch {
        res.redirect('/books')
    }
}

// making the router global or accessable 
module.exports = router