import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const getUserDetails = expressAsyncHandler(async(req, res) => {

    const user = await User.findById({_id: req.params.id})
        .populate('identity')
        .populate('contact')
        .populate('transactions')

    if(user){
        res.status(201).json({ "status": "success", "data": user, "message": "user details retrieved successfully"})
    }
})


export {
    getUserDetails
}