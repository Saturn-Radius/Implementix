"use strict"
var fs = require('fs')
var samlp = require('samlp')
var extend = require('extend')
let jwt = require('jsonwebtoken')
var API_KEY = 'f6bdc1df0322966bbb811795e1a28221'

var SimpleProfileMapper = require('./sso.js')
var privateKey  = fs.readFileSync('ssl/server/server.key')
var certificate = fs.readFileSync('ssl/server/server.crt')
const idpOptions = {
  issuer:                 'implementix-sso',
  cert:                   certificate,
  key:                    privateKey,
  audience:               'TrackVia',
  recipient:              'https://go.trackvia.com/saml/SSO',
  destination:            'https://go.trackvia.com/saml/SSO',
  acsUrl:                 'https://go.trackvia.com/saml/SSO',
  RelayState:             undefined,
  allowRequestAcsUrl:     true,
  digestAlgorithm:        'sha256',
  signatureAlgorithm:     'rsa-sha256',
  signResponse:           true,
  encryptAssertion:       false,
  encryptionAlgorithm:    'http://www.w3.org/2001/04/xmlenc#aes256-cbc',
  keyEncryptionAlgorithm: 'http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p',
  lifetimeInSeconds:      3600,
  authnContextClassRef:   'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport',
  includeAttributeNameFormat: true,
  profileMapper:          SimpleProfileMapper,
  getUserFromRequest:     function(req) { return req.user },
  getPostURL:             function (audience, authnRequestDom, req, callback) {
                            return callback(null, (req.authnRequest && req.authnRequest.acsUrl) ?
                            req.authnRequest.acsUrl :
                            'https://go.trackvia.com/saml/SSO')
                          }
}

function getHashCode(str) {
  var hash = 0
  if (str.length == 0) return hash
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i)
    hash = ((hash<<5)-hash)+char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

const parseSamlRequest = function(req, res, next) {
  samlp.parseRequest(req, function(err, data) {
    if (err) {
      console.log({
        message: 'SAML AuthnRequest Parse Error: ' + err.message,
        error: err
      })
    }
    var authnRequest = {}
    if (data) {
       authnRequest= {
        relayState: req.query.RelayState || req.body.RelayState,
        id: data.id,
        issuer: data.issuer,
        destination: data.destination,
        acsUrl: data.assertionConsumerServiceURL,
        forceAuthn: data.forceAuthn === 'true'
      }
      // console.log('Received AuthnRequest => \n', authnRequest)
    }

    // get req user
    let token = req.cookies.token
    jwt.verify(token, API_KEY, function(err, decoded) { 
			if(err) {
				var auth = new Buffer(JSON.stringify(authnRequest)).toString('base64')
        res.redirect('/?SAMLRequest=' + auth)
			} else{
				let username = decoded.username
				let password = decoded.password
        req.user.email = username
        if(req.user.email && data){ // already authenticated
          const authOptions = extend({}, req.idp.options)
          // Apply AuthnRequest Params
          authOptions.inResponseTo = authnRequest.id
          if (req.idp.options.allowRequestAcsUrl && authnRequest.acsUrl) {
            authOptions.acsUrl = authnRequest.acsUrl
            authOptions.recipient = authnRequest.acsUrl
            authOptions.destination = authnRequest.acsUrl
            authOptions.forceAuthn = authnRequest.forceAuthn
          }
          if (authnRequest.relayState) {
            authOptions.RelayState = authnRequest.relayState
          }
          if (!authOptions.encryptAssertion) {
            delete authOptions.encryptionCert
            delete authOptions.encryptionPublicKey
          }
    
          // Set Session Index
          authOptions.sessionIndex = req.user.sessionIndex
          // Keep calm and Single Sign On
          // console.log('Sending SAML Response\nUser => \n%s\nOptions => \n', JSON.stringify(req.user, null, 2), authOptions)
          samlp.auth(authOptions)(req, res)
        }else{
          var auth = new Buffer(JSON.stringify(authnRequest)).toString('base64')
          res.redirect('/?SAMLRequest=' + auth)
        }
			}
		})    
  })
}

const sendSamlResponse = function(req, res, next) {
  const authOptions = extend({}, req.idp.options)
  if(req.query.auth){
    var buffer = new Buffer(req.query.auth, 'base64')
    req.authnRequest = JSON.parse(buffer.toString('utf8'))
    
    // Apply AuthnRequest Params
    authOptions.inResponseTo = req.authnRequest.id
    if (req.idp.options.allowRequestAcsUrl && req.authnRequest.acsUrl) {
      authOptions.acsUrl = req.authnRequest.acsUrl
      authOptions.recipient = req.authnRequest.acsUrl
      authOptions.destination = req.authnRequest.acsUrl
      authOptions.forceAuthn = req.authnRequest.forceAuthn
    }
    if (req.authnRequest.relayState) {
      authOptions.RelayState = req.authnRequest.relayState
    }
  }  

  if (!authOptions.encryptAssertion) {
    delete authOptions.encryptionCert
    delete authOptions.encryptionPublicKey
  }

  // get req user
  let token = req.cookies.token
  jwt.verify(token, API_KEY, function(err, decoded) { 
    if(err) {
      console.log('sendSamlResponse decode failed', err)
      next()
    } else{
      let username = decoded.username
      let password = decoded.password
      req.user.email = username
      // Set Session Index
      authOptions.sessionIndex = req.user.sessionIndex
      // Keep calm and Single Sign On
      // console.log('Sending SAML Response\nUser => \n%s\nOptions => \n',  JSON.stringify(req.user, null, 2), authOptions)
      samlp.auth(authOptions)(req, res)
    }
  })
}

const getMetadata = function(req, res) {
  samlp.metadata(req.idp.options)(req, res)
}

const logout = function(req, res) {
  console.log('logout called')
  res.clearCookie('token')
  res.redirect('/')
}

let Router = require('express').Router
let router = module.exports = Router()

router.use(function(req, res, next) {
  req.user = {
    email: 'johndoe@implementix.com',
    sessionIndex: Math.abs(getHashCode(req.session.id))
  }  
  req.metadata = SimpleProfileMapper.prototype.metadata
  req.idp = { options: idpOptions }
  next()
})

// route for sso
router.get('/idp', parseSamlRequest)
router.post('/idp', parseSamlRequest)
router.get('/sso', sendSamlResponse)
router.get('/metadata', getMetadata)
router.get('/logout', logout)