const  jwt = require('jsonwebtoken');

function signJWTToken(id) {
    return jwt.sign({
        user: id
    }, process.env.JWT_SECRET)
}

module.exports = {
    signJWTToken
}