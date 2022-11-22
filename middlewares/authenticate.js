const auth = require('basic-auth');
const asyncHandler = require('express-async-handler')
const User = require('../models/identityModel')

const secured = asyncHandler(async (req, res ,next) => {

    try {

        const user = auth(req);

        if(user?.name === 'shadow' && user?.pass === 'db'){
            next()
        } else {
            res.status(401).json({"status": "error", "message": 'invalid request', "meta": {"error":"invalid credentials"}})
            throw new Error('Not authorized, invalid credentials')
        }       

    }catch(e){
        res.status(401)
    }

})

module.exports = {
    secured
}