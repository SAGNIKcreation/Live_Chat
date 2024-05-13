//Creating connection between Socket.io to Node Server at 8000 port..
const io = require("socket.io-client");
const socket = io('http://localhost:8000');

//Getting all DOM elements into respective JS veriables declaration..
const form = document.getElementById('send-message');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

//For notification sound effect..
var audio= new Audio('Ding_Sound.mp3')

//Creating append fuction..
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText= message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

//Set my own messages at right side of the chat..
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';

})

//Promt for entering name when new user tries to join..
const Name = prompt('Enter your name to join chat: ');
socket.emit('new-user-joined', Name);

//"New User joined the chat" at middle of the chat..
socket.on('user-joined', Name =>{
    append(`${Name} joined the chat.`, 'middle')
})

//Set others message at the left side of the chat..
socket.on('receive', data =>{
    append(`${data.Name}: ${data.message}`, 'left')
})

//"User left the chat" at middle of the chat..
socket.on('left', Name =>{
    append(`${Name} Left the chat.`, 'middle')
})