# jwt-auth-node

jwt-auth-node is a promisebased npm package for simple JWT implementation.

It was built on top of jsonwebtoken (https://www.npmjs.com/package/jsonwebtoken) and features all its adventages + extra features like an express middleware for even simpler usage.

## Installation
```
npm install --save jwt-auth-node
```

## Setup
```
const auth = require("jwt-auth-node")

auth.config({
    secret: "secret"
})
```

if you just want to configure the secret you can also use `auth(key)` instead of the config function

#### Example:
```
const auth = require("jwt-auth-node")

auth("secret")
```

### Config Options

Due to the fact that jwt-auth-node is build on top of jsonwebtoken you can use all of its configuration options.

List of options: (https://www.npmjs.com/package/jsonwebtoken#usage).

Additionally you can use:
* `secret`: Set your custom secret

## Custom Error Messages
### Configure all messages
__IMPORTANT:__ because you are overwriting all messages you have to configure all of them in order to not break the code.
```
auth.errorMessages = {
    noToken: "there was no token provided",
    invalidToken: "the token is invalid"
}
```
### Configure an individual message

```
auth.errorMessages.noToken = "there was no token provided"
```

* `invalidToken`: the message sent when the token couldn't be confirmed with the secret
* `noToken`: the message sent when there was no token provided

## Generating a Token
The `generateToken(data)` function returns a Promise for simpler usage
```
auth.generateToken(data)
    .then(token => {
        // code is executed when the token was generated successfully
    })
    .catch(err => {
        // code is excuted when there was an error
    })
```

#### Example:

```
auth.generateToken({
    id: user.id,
    username: user.username
}).then(token => {
    res.status(202).json({
        token
    })
}).catch(err => {
    console.log(err)
    res.status(500).json({
        success: false
    })
})
```

## Verifying a Token
The `verifyToken(data)` function returns a Promise for simpler usage

If you are using Express.js check out the Middleware section.

__IMPORTANT:__ <br>
you have to check wether the authorization header is provided or not on your own when using this function instead of the middleware

```
auth.verifyToken(token).then(data => {
    // code is executed when the token was verified successfully
}).catch(err => {
    // code is executed when the token couln't be verified
})
```

## Middleware

We provide a middleware to protect your Express.js routes.

### Global Middleware

Use `app.use(auth.protect)` or `app.use(auth.middleware)` in order to protect all following routes.

#### Example:

```
const app = express()
const auth = require("jwt-auth-node")

auth.config({
    secret: "secret"
})

app.get("/unprotected/", (req, res) => {
    // unprotected content
})

app.use(auth.protect) // you can also use: app.use(auth.middleware)

app.get("/protected/", (req, res) => {
    // protected content
})
```

### Individual Middleware

You can also use `app.use(auth.protect)` or `app.use(auth.middleware)` to protect a specific route

#### Example:

```
const app = express()
const auth = require("jwt-auth-node")

auth.config({
    secret: "secret"
})

app.get("/unprotected/", (req, res) => {
    // unprotected content
})

app.get("/protected/", auth.protect, (req, res) => {
    // protected content
})
```

## Changelog

* __v1.0.0__: Initial Release
