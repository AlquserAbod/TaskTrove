const  jwt = require('jsonwebtoken');

function signJWTToken(user) {
    return jwt.sign({
        user: user
    }, process.env.JWT_SECRET)
}

module.exports = {
    signJWTToken
}