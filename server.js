if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '.env' })
}

const express = require('express')
const mongoose = require('mongoose')
const app = express()
const expressLayouts = require('express-ejs-layouts')

// //mongo url connection local
// mongoose.connect('mongodb://localhose:27017/EbraryDB')

//mongo url connection online
mongoose.connect(process.env.DATABASE_URL, { useNewURLParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

//routes folder
const indexRouter = require('./routes/index')

//views folder and engine
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.set('layout', 'layouts/layout')
app.use(express.urlencoded({ extended: false }));
app.use(expressLayouts)
app.use(express.static('public'))

//hooking the routes
app.use('/',indexRouter)

app.listen(process.env.PORT || 3000, ()=> {
  console.log("Server started at port 3000")
})

