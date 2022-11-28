const form = document.getElementById('chat-form');
const messages = document.querySelector('.chat-messages');

const { username, room } = Qs.parse(location.search , {
    ignoreQueryPrefix: true
})

const socket = io()

console.log(username, room)

socket.on('chat', message => {
    console.log(message)
    sendMessage(message)
})

socket.on('chatmessage', message => {
    console.log(message)
    sendMessage(message)
})

socket.on('message', message => {
    console.log(message)
    sendMessage(message)
})



socket.on('allChatUsers', message => {
    console.log('allChatUsers', message)
   
})

// socket.on('allMessages', (data) => {
//     console.log("All Messages", data)
// })

socket.on('allMessages', message => {
    console.log('allMessages', message)
})

socket.emit('connectedUser', '637f77b85bc74ec93557073b')


socket.emit('chatuser', {senderId: '637f77b85bc74ec93557073b', receiverId: '637f77a85bc74ec935570737', type: 'load messages'})

socket.emit('feeds')

socket.on('feedsMessages', data => {
    console.log('Feeds', data)
})



socket.on('newFeedMessage', (msg) => {
    console.log('Msg', msg)
})


form.addEventListener('submit', (e) => { 
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    const data = {senderId: '637f77b85bc74ec93557073b', receiverId: '637f77a85bc74ec935570737', message: msg, type: 'send message'}
    socket.emit('chatuser', data)
    // console.log('emit data', data)

    socket.emit('sendFeedMessage', {
        message: msg,
        userId: '637f77b85bc74ec93557073b',
        receiverId: "637f77a85bc74ec935570737"
    })

}, false)

const sendMessage = (msg) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
                     <div class="message">
						<p class="meta">James <span>9:30AM</span></p>
						<p class="text">
							${msg}
						</p>
					</div>
    `
    messages.appendChild(div)
}