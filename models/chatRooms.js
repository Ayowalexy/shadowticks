import mongoose from "mongoose";
const Schema = mongoose.Schema;



const chatRoomSchema = new Schema({
    roomId: String,
    messages: [{
        type: Object
    }],
    users: [{
        type: Object
    }],
    senderId: String, 
    receiverId: String
})

const Room = mongoose.model('chatroom', chatRoomSchema);

export default Room