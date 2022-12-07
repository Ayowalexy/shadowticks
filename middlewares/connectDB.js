import mongoose from "mongoose";

const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE


const DB = process.env.MONGODB_URI || 'mongodb+srv://shadow:shaodow100@cluster0.pgbbmll.mongodb.net/?retryWrites=true&w=majority'

const connectDB = async () => {
    try {
        mongoose.connect(DB,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'))
        db.once('open', () => {
            console.log('Database connected')
        })
    } catch (e) {
        console.log(e)
    }
} 

export default connectDB