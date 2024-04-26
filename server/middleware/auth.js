const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const { Types } = require('mongoose');

async function auth(req, res, next) {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        
        if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = verified.user;

        if (!user) return res.status(401).json({ errorMessage: "Unauthorized" });

        req.user = await User.findById(user._id);

        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ errorMessage: "Unauthorized" });
    }
}

module.exports = auth
