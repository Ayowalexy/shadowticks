After initializing a connection to the socktet.
eg io.on('connection', socket => {})



To initiate a chat between two users, connect to

## chatuser

passing an object with 4 fields

senderId, receiverId, message, type

### senderId (string !required)  - _id of the user sending the message eg(637f77b85bc74ec93557073b) 
### receiverId (string !required)  - _id of the user the message is sent to eg(637f77b85bc74ec93557073b) 
message - (string ! required) - the message to be sent
type(string !required) - [load messages | send message] the value should be load messages to load all previous messages between two users, an array of all messages is returned and send message to send a single message, the sent message is returned

To load all messages eg: socket.emit('chatuser', {senderId: '637f77b85bc74ec93557073b', receiverId: '637f77a85bc74ec935570737', type: 'load messages'})

To Send a message eg:  const data = {senderId: '637f77b85bc74ec93557073b', receiverId: '637f77a85bc74ec935570737', message: msg, type: 'send message'}
     socket.emit('chatuser', data)








To get Listen for all new messages on a socket between to users, listen on this socket

## allMessages

eg socket.on('allMessages', (data) => {
    console.log("All Messages", data)
})

an Array of all the messages between two users is returned in real time








To listen for message sent between two users, listen on this socket

## message

eg socket.on('message', message => {
    console.log(message)
})








To get all the feed messages, emit from this socket and pass nothing to the connections

## feeds
 eg socket.emit('feeds')








After emitting, you should then listen on this socket for all the messages

## feedsMessages

eg socket.on('feedsMessages', data => {
    console.log('Feeds', data)
})

An array of all the messages is returned







To send a message to a feed, emit on this socket

## sendFeedMessage

eg  socket.emit('sendFeedMessage', {
        message: msg,
        userId: '638022bafe991869c79054e9'
    })


To listen for new message in a feed, listen on thiis socket

## newFeedMessage

eg  socket.on('newFeedMessage', (msg) => {
    console.log('Msg', msg)
})