import mongoose from "mongoose";
const Schema = mongoose.Schema;

const identitySchema = new Schema({
    userId: String,
    name: String,
    imageSvg: String,
    isOwnned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Identity = mongoose.model('identity', identitySchema)

export default Identity