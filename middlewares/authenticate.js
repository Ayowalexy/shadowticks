import auth from 'basic-auth';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const { verify } = jwt;

const secured = expressAsyncHandler(async (req, res, next) => {

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


const protect = expressAsyncHandler(async (req, res, next) => {
    let token

    try {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ')
            const bearerToken = bearer[1]
            token = bearerToken;
            const decoded = verify(bearerToken, process.env.SECRET)
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

export {
    secured,
    protect
}