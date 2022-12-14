import Room from '../models/chatRooms.js';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import moment from 'moment';
import Feed from '../models/feed.js';
import Message from '../models/message.js';
import { v4 as uuidv4 } from 'uuid';


const clear = async () => {
    await Feed.deleteMany({});
    await Message.deleteMany({});
    await Room.deleteMany({})
    console.log('cleared')
}



const joinChat = async (id) => {
    try {

        const ids = id.split('-')

        const case_1 = ids[0].concat('-', ids[1])
        const case_2 = ids[1].concat('-', ids[0])

        const userroom_1 = await Room.findOne({ roomId: case_1 })
        const userroom_2 = await Room.findOne({ roomId: case_2 })

        let room_ = userroom_1 ? userroom_1 : userroom_2

        if (room_) {
            return room_
        } else {
            const newRoom = new Room({ roomId: id });
            await newRoom.save();
            room_ = newRoom
        }


        return room_
    } catch (e) {
        return e
    }
}

const addMessage = async (id, message, from, to, senderId, receiverId, isFundRequest = false) => {
    try {
        const msgId = uuidv4();
        const room = await Room.findById({ _id: id })
        const msg = { message, from, to, time: moment().format('h:mm a'), senderId, receiverId, msgId, isFundRequest}
        if (room) {
            room.messages.push(msg)
            await room.save();
            return msg;
        }

    } catch (e) {
        return e
    }
}

const getAllMessagess = async (id) => {
    try {


        const room = await Room.findById({ _id: id });

        if (room && room.messages.length) {
            const msg1 = room.messages[0]
            const receiver = await User.findById({_id : msg1.receiverId}).populate('identity').populate('transactions')
            const sender = await User.findById({_id: msg1.senderId}).populate('identity').populate('transactions')

            if(receiver && sender){
                const messages = room.messages;

                let msg = [];

                for(let el of messages){
                    msg.push(
                        {
                            ...el,
                            senderDetails: sender,
                            receiverDetails: receiver
                        }
                    )
                }
                return msg
            }
            
        }
        return
    } catch (e) {
        return e
    }
}


const getUser = async (id) => {
    try {
        const user = await User.findById({ _id: id }).populate('identity').populate('contact')
        return user
    } catch (e) {
        return e
    }
}


const getAllFeeds = async () => {
    try {

        const feeds = await Feed.find().populate({
            path: 'messages',
            populate: {
                path: 'sentBy',
                populate: 'identity'
            }
        })
        return feeds

    } catch (e) {
        return e
    }
}

const sendFeedMessage = async (message, sentBy, isFundRequest = false) => {

    try {
        const time = moment().format('h:mm a');
        const msgId = uuidv4();
        const newMessage = new Message({ time, message, isFundRequest, msgId });
        newMessage.sentBy = sentBy;

        const all = await Feed.find()
        // const feed = all[0]

        const feed = new Feed()
        feed.messages.push(newMessage);
        await feed.save()

        await newMessage.save();
        return newMessage
    } catch (e) {
        return e
    }

}

const getAllChatFeeds = async (id) => {
    try {

        const allUser = await User.findById({_id: id}).populate('contact').populate('identity')
        const contact = allUser.contact;

        return contact;

    } catch (e) {
        return e
    }
}


const addToContact = async (userId, contactId) => {
    try {

        const user = await User.findById({_id: userId});
        const contact = await User.findById({_id: contactId});

        if(user && contact){
            user.contact.push(contact);
            await user.save()
        } 

    } catch (e) {
        return e
    }
}

export {
    joinChat,
    getUser,
    addMessage,
    getAllMessagess,
    sendFeedMessage,
    getAllFeeds,
    getAllChatFeeds,
    addToContact
}