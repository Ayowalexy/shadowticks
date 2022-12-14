import mongoose from "mongoose";
const Schema = mongoose.Schema;


const messageSchema = new Schema({
    message: String,
    time: String,
    isFundRequest: {
        type: Boolean,
        default: false
    },
    reactions: [{
        type: Object
    }],
    sentBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    msgId: String
}, { timestamps: true })


const Message = mongoose.model('message', messageSchema);

export default Message