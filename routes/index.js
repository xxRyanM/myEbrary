const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
 res.render('index')
})

// making the router global or accessable 
module.exports = router