const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { readdirSync } = require('fs')
const path = require('path');
const app = express()

// Middleware
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use('/exports', express.static(path.join(__dirname, 'exports')));

 


readdirSync('./routes').map((c)=>app.use('/api',require('./routes/'+c)))
app.listen(5000,()=>console.log('server is run on port 5000'))