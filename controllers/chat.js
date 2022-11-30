import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { messageSchema } from '../middlewares/schema.js';
import Message from '../models/message.js';


const generateUrl = expressAsyncHandler(async (req, res) => {

    const user = await User.findById({ _id: req.user._id });

    if (user) {
        const url = `shadowticks://chat/${user._id.toString()}`

        res.status(200).json({ "status": "success", "data": url, "meta": {} })
    }
})

const addReaction = expressAsyncHandler(async (req, res) => {

    const { error, value } = messageSchema.validate(req.body);

    if (error) {
        return res
            .status(401)
            .json(
                {
                    status: "error",
                    message: "invalid request",
                    meta: {
                        error: error.message
                    }
                })
    }


    const message = await Message.findById({ _id: req.params.id });

    if (message) {
        message.reactions.push(value.reaction);
        await message.save();
        res.status(201).json({message: "reaction added succesfully", data: message, meta: {}})
    }
})

export {
    generateUrl,
    addReaction
}