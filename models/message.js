import mongoose from "mongoose";
const Schema = mongoose.Schema;


const messageSchema = new Schema({
    message: String,
    time: String,
    reactions: [{
        type: String
    }],
    sentBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })


const Message = mongoose.model('message', messageSchema);

export default Message