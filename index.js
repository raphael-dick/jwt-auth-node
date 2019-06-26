const jwt = require("jsonwebtoken")

// Exports

module.exports = setSecret
module.exports.config = setConfig
module.exports.generateToken = generateToken
module.exports.verifyToken = verifyToken
module.exports.middleware = module.exports.protect = middleware

// Variables

var errorMessages = module.exports.errorMessages = {
	invalidToken: "invalid token",
	noToken: "no token provided"
}

let config = {
	expiresIn: "12h"
}

let secret;

// Functions
function setSecret(key) {
	secret = key
}

function setConfig(cfg) {
	if (cfg.secret != null) {
		secret = cfg.secret
		delete cfg.secret
	}
	config = cfg
}

function generateToken(data) {
	return new Promise((resolve, reject) => {
		var token = jwt.sign(data, secret, config)
		resolve(token)
	})
}

function verifyToken(token) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret, (err, decoded) => {
			if (err) reject(err)
			resolve(decoded)
		});
	});
}

function middleware(req, res, next) {
	if (!req.headers.authorization) {
		res.status(401).json({
			error: errorMessages.noToken
		})
		return
	}

	verifyToken(req.headers.authorization).then(data => {
		req.auth = data
		next()
	}).catch(err => {
		res.status(403).json({
			error: errorMessages.invalidToken
		})
	})
}