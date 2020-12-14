// imports
require('dotenv').config();
const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const session = require('express-session')
const isLoggedIn = require('./middleware/isLoggedIn');
const passport = require('./passport')

const port = process.env.PORT || 4000
const app = express()

console.log('***********************')
console.log(process.env.CLIENT_URL)
console.log('***********************')

// middleware - JSON parsing
app.use(express.json())
// middleware - cors
const corsOptions = {
  // from which URLs do we want to accept requests
  origin: ['http://localhost:3000', process.env.CLIENT_URL],
  credentials: true, // allow the session cookie to be sent to and from the client
  optionsSuccessStatus: 204
}

app.use(cors(corsOptions))

// middleware - session config
app.use(session({
  // session is stored in the DB
  secret: "ILikePizza",
  resave: false, // will not resave sessions
  saveUninitialized: false, // only create a session when a property is added to the session
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  } 
}))

// middleware - passport config
app.use(passport.initialize())
app.use(passport.session())

// middleware for logged in user

app.use((req, res, next)=> {
  console.log(req.session)
  if (req.user) {
    console.log('the logged in user is')
    console.log(req.user)
    console.log('their id is')
    console.log(req.user.id)
    console.log('the req.session is')
    console.log(req.session)
  }
  next()
})


// middleware - API routes
app.use('/api/v1/auth', routes.auth)
app.use('/api/v1/games', routes.games)

// connection
app.listen(port, () => console.log(`Server is running on port ${port}`))
