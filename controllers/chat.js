import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Room from '../models/chatRooms.js';
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
    const user = await User.findById({_id: req.params.userId}).populate('identity')

    if (message && user) {
        const obj = {
            user: user.identity.name,
            reaction: value.reaction
        }
        message.reactions.push(obj);
        await message.save();
        res.status(201).json({message: "reaction added succesfully", data: message, meta: {}})
    }
})

const deleteFeedMessage = expressAsyncHandler( async (req, res ) => {
    const message = await Message.findByIdAndDelete({_id: req.params.id});
    const allMessages = await Message.find()
    res.status(201).json({message: "message deleted succesfully", data: allMessages, meta: {}})
})

const deleteRoomMessage = expressAsyncHandler( async (req, res) => {
    const rooms = await Room.find();

    if(Array.isArray(rooms)){
        const msg = rooms.filter(ele => ele.roomId.includes(req.params.id) && ele.roomId.includes(req.params.receiver));
        if(msg.length){
            
            const msgId = msg[0].messages.findIndex(ele => ele.msgId === req.params.msgId);
            
            const sliced = msg[0].messages.splice(msgId, 1);
            rooms.messages = msg[0].messages;
            const roomMsg = await Room.findById({_id: msg[0]._id.toString()})
            roomMsg.messages = msg[0].messages;
            await roomMsg.save();
            res.status(201).json({message: "message deleted succesfully", data: rooms.messages , meta: {}})
        }
    }
})

export {
    generateUrl,
    addReaction,
    deleteFeedMessage,
    deleteRoomMessage
}