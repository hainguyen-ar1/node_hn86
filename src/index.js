import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDb } from './config/db.js'
import { securityMiddleware, limiter, authLimiter, corsOptions } from './middleware/security.js'

dotenv.config()

import userRouter from './routers/users.route.js'
import categoryRouter from './routers/category.route.js'
import productRouter from './routers/product.route.js'
import routerUpload from './routers/upload.route.js'
import { errorHandler } from './middleware/error.js'
import routerOrder from './routers/order.route.js'
// import { upload } from './middleware/upload.js'

// const upload = multer({ dest: 'uploads/' });

const app = express()

// Security middleware
app.use(securityMiddleware)

// CORS configuration
app.use(cors(corsOptions))

// Body parsing middleware
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rate limiting
app.use('/api', limiter) // General rate limiting for all API routes

// Connect to database
connectDb()

const port = process.env.PORT || 3000

const myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}
const requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}

app.use(requestTime)

app.get('/', (req, res) => {
  let responseText = 'Hello World!<br>'
  responseText += `<small>Requested at: ${req.requestTime}</small>`
  res.send(responseText)
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime()
  })
})

// Auth routes with strict rate limiting (5 requests per 15 minutes)
app.use('/user/login', authLimiter)
app.use('/user/register', authLimiter)

// API routes
app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/product', productRouter);
app.use('/order', routerOrder);
app.use('/upload',
  //  upload.single('file'),
  routerUpload);

app.use(express.static('./public'));// set public folder for upload by

app.get('/', (req, res) => res.send('/index.html'));

app.use(errorHandler)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

