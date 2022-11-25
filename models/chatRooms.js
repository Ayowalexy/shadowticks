const mongoose = require('mongoose');
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

module.exports = mongoose.model('chatroom', chatRoomSchema)