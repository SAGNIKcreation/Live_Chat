// Create a connection to the Socket.io server
const socket = io('http://localhost:8000');

// Get DOM elements
const form = document.getElementById('send-message');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// For notification sound effect
var audio = new Audio('Ding_Sound.mp3');

// Function to append messages to the chat
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position === 'left') {
        audio.play();
    }
}

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

// Prompt for entering name when new user joins
const Name = prompt('Enter your name to join chat: ');
socket.emit('new-user-joined', Name);

// Handle new user joined message
socket.on('user-joined', Name => {
    append(`${Name} joined the chat.`, 'middle');
});

// Handle receiving messages from others
socket.on('receive', data => {
    append(`${data.Name}: ${data.message}`, 'left');
});

// Handle user left message
socket.on('left', Name => {
    append(`${Name} left the chat.`, 'middle');
});
