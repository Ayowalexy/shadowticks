const auth = require('basic-auth');
const asyncHandler = require('express-async-handler')
const User = require('../models/identityModel');
const jwt = require('jsonwebtoken')

const secured = asyncHandler(async (req, res, next) => {

    try {

        const user = auth(req);

        if (user?.name === 'shadow' && user?.pass === 'db') {
            next()
        } else {
            res.status(401).json({ "status": "error", "message": 'invalid request', "meta": { "error": "invalid credentials" } })
            throw new Error('Not authorized, invalid credentials')
        }

    } catch (e) {
        res.status(401)
    }

})


const protect = asyncHandler(async (req, res, next) => {
    let token

    try {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ')
            const bearerToken = bearer[1]
            token = bearerToken;
            const decoded = jwt.verify(bearerToken, process.env.SECRET)
            const user = await User.findOne({ userId: decoded.userId });


            if (user) {
                req.user = user;
                next()
            } else {
                res
                    .status(401)
                    .json(
                        {
                            status: "error",
                            message: "invalid request",
                            meta: {
                                error: 'user does not exist'
                            }
                        })
            }
        }
    } catch (e) {
        res.status(401)
        throw new Error('Not authorized, token failed')
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

module.exports = {
    secured,
    protect
}