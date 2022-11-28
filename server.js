if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}
const express = require('express');
const app = express();
const compression = require('compression');
const { errorHandler, notFound } = require('./middlewares/errorhandler')
const session = require('express-session');
const socketIO = require('socket.io');
const http = require('http');
const cors = require('cors')
const path = require('path')
const connectDB = require('./middlewares/connectDB');
const {
    joinChat,
    getUser,
    addMessage,
    getAllMessagess,
    getAllFeeds,
    sendFeedMessage,
    getAllChatFeeds,
    addToContact
} = require('./middlewares/userchat')

const server = http.createServer(app)
const io = socketIO(server, {
    cors: {
        origin: "*"
    }
})


//routes
const AuthRoutes = require('./routes/auth');
const WalletRoutes = require('./routes/wallet')
const UrlRoutes = require('./routes/chat')


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
app.use('/url', UrlRoutes)


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


        if(!senderHasAddedReceicer){
            await addToContact(userId, receiverId)
        }
        if(!receiverHasAddedSender){
            await addToContact(receiverId, userId)
        }

        if (sentBy) {
            const sendMessage = await sendFeedMessage(message, sentBy);
            if (sendMessage) {
                io.emit("newFeedMessage", sendMessage);
            }
        }
    })

})

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`))