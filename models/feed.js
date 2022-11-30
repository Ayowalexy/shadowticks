import mongoose from "mongoose";
const Schema = mongoose.Schema;


const feedsSchema = new Schema({
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'message'
    }],
})

const Feed = mongoose.model('feed', feedsSchema);

export default Feed