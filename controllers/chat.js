const asyncHandler = require('express-async-handler');
const User = require('../models/userModel')


const generateUrl = asyncHandler(async(req, res) => {

    const user = await User.findById({_id: req.user._id});

    if(user){
        const url = `shadowticks://chat/${user._id.toString()}`

        res.status(200).json({"status": "success", "data": url, "meta": {}})
    }
})

module.exports = {
    generateUrl
}