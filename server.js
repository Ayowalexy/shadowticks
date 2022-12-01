import * as dotenv from 'dotenv';
import compression from 'compression';
import session from 'express-session';
import * as socketIO from 'socket.io';
import http from 'http';
import cors from 'cors';
import path from 'path';
import AuthRoutes from './routes/auth.js'
import WalletRoutes from './routes/wallet.js'
import UrlRoutes from './routes/chat.js'
import UserRoutes from './routes/user.js'
import connectDB from './middlewares/connectDB.js';
import { errorHandler, notFound } from './middlewares/errorhandler.js';
import express from 'express';
import {
    joinChat,
    getUser,
    addMessage,
    getAllMessagess,
    getAllFeeds,
    sendFeedMessage,
    getAllChatFeeds,
    addToContact
} from './middlewares/userchat.js';
import { Server } from "socket.io";
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// dotenv.config({ path: '/.env'});

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});



const server = http.createServer(app)

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

// middlewares
app.use(session(sessionConfig))
app.use(express.json());
app.use(compression());
app.use(cors())
app.use(express.urlencoded({ limit: "500mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));


//intailize database


connectDB()

app.get('/', (req, res) => {
    res.json({ message: "Connected" })
})

app.use('/auth', AuthRoutes)
app.use('/wallet', WalletRoutes)
app.use('/chat', UrlRoutes)
app.use('/users', UserRoutes)


io.on('connection', socket => {

    socket.on('chatuser', async (data) => {

        const { senderId, receiverId, message, type } = data;

        let roomId = `${senderId}-${receiverId}`

        const room = await joinChat(roomId);

        if (room) {
            const roomUUid = room._id.toString();

            socket.join(roomUUid);

            const sender = await getUser(senderId);

            const receiver = await getUser(receiverId);

            const allMessages = await getAllMessagess(roomUUid);


            if (type === 'load messages') {
                io.to(roomUUid).emit("allMessages", [...allMessages]);
            } else {


                const { senderId, message, receiverId } = data;

                const sentBy = await getUser(senderId);
                const receivedBy = await getUser(receiverId);
        
                const senderHasAddedReceicer = sentBy?.contact?.some(element => element._id.toString() === receiverId);
        
                const receiverHasAddedSender = receivedBy?.contact?.some(element => element._id.toString() === senderId);
        
                console.log(senderHasAddedReceicer, receiverHasAddedSender)
                if (!senderHasAddedReceicer) {
                    await addToContact(senderId, receiverId);
        
                    const contact = await getAllChatFeeds(senderId);
        
                    socket.join(senderId);
        
                    io.to(senderId).emit("allChatUsers", contact);
                }
                if (!receiverHasAddedSender) {
                    await addToContact(receiverId, senderId);
        
                    const contact = await getAllChatFeeds(receiverId);
        
                    socket.join(receiverId);
        
                    io.to(receiverId).emit("allChatUsers", contact);
                    
                }



                const newMessage = await addMessage(roomUUid, message, sender.identity.name, receiver.identity.name, sender._id.toString(), receiver._id.toString())
                io.to(roomUUid).emit("message", newMessage);
                io.to(roomUUid).emit("allMessages", [...allMessages, newMessage]);
            }

        }
    })


    socket.on('feeds', async () => {

        const feeds = await getAllFeeds();
        io.emit("feedsMessages", feeds);

    })

    socket.on('connectedUser', async (id) => {

        const contact = await getAllChatFeeds(id);

        socket.join(id);

        io.to(id).emit("allChatUsers", contact);

    })


    socket.on('sendFeedMessage', async (data) => {
        const { userId, message, receiverId } = data;

        const sentBy = await getUser(userId);
        const receivedBy = await getUser(receiverId);

        const senderHasAddedReceicer = sentBy?.contact?.some(element => element._id.toString() === receiverId);

        const receiverHasAddedSender = receivedBy?.contact?.some(element => element._id.toString() === userId);

        console.log(senderHasAddedReceicer, receiverHasAddedSender)
        if (!senderHasAddedReceicer) {
            await addToContact(userId, receiverId);

            const contact = await getAllChatFeeds(userId);

            socket.join(userId);

            io.to(userId).emit("allChatUsers", contact);
        }
        if (!receiverHasAddedSender) {
            await addToContact(receiverId, userId);

            const contact = await getAllChatFeeds(receiverId);

            socket.join(receiverId);

            io.to(receiverId).emit("allChatUsers", contact);
            
        }

        if (sentBy) {
            const sendMessage = await sendFeedMessage(message, sentBy);
            if (sendMessage) {
                const feeds = await getAllFeeds();
                io.emit("feedsMessages", feeds);
                io.emit("newFeedMessage", sendMessage);
            }
        }
    })

})

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`))