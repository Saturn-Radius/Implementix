var fs = require('fs')
var path = require('path')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var compression = require('compression')
var express = require('express')
var gm = require('gm')
var pipe = require('multipipe')
var logger = require('morgan')
var session = require('express-session')

// Certificates
var bundle  = fs.readFileSync('ssl/server/server.ca-bundle')
var privateKey  = fs.readFileSync('ssl/server/server.key')
var certificate = fs.readFileSync('ssl/server/server.crt')
var credentials = {ca: bundle, key: privateKey, cert: certificate}

// Construct Express
var app = express()
app.use(function(req, res, next) {  
  if((!process.env.CONFIG_IS_SANDBOX) && (!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
    res.redirect('https://' + req.get('Host') + req.url)
  }
  else
    next()
})
app.use(compression())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json({
  strict: true,
  type: ['application/json', 'application/vnd.api+json']
}))
// app.use(logger(':date> :method :url - {:referrer} => :status (:response-time ms)'))
app.use(session({
  secret: 'The universe works on a math equation that never even ever really ends in the end',
  resave: false,
  saveUninitialized: true,
  name: 'idp_sid',
  cookie: { maxAge: 60000 }
}))
app.use(function(req, res, next) {
  // headers
  var baseURL = req.secure ? "https://" + req.headers.host + "/" : "http://" + req.headers.host + "/"
  var allowedOrigins = [baseURL, "https://ix-touchpoint.com", "http://ix-touchpoint-staging.com"]
  var origin = req.headers.origin
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, PUT, POST, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Credentials', true)
  next()
})
app.use(require('./api/saml'))
app.use(require('./api/api'))
app.use(express.static('dist'))
app.get('*', function(req, res) {  
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Creating Server
var http = require('http')
var https = require('https')
var httpServer = http.createServer(app)
httpServer.listen(process.env.CONFIG_PORT_NUM, function(){
  console.log('http is running')
})
if(!process.env.CONFIG_IS_SANDBOX){
  var httpsServer = https.createServer(credentials, app)
  httpsServer.listen(process.env.CONFIG_PORT_NUM_HTTPS, function(){
    console.log('https is running', process.env.CONFIG_PORT_NUM_HTTPS)
  })
}
