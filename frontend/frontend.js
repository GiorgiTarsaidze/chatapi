let websocket;
let token;

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });

    const data = await response.json();
    token = data.access;
    console.log('JWT Token:', token);
    connectWebSocket();
}

async function connectWebSocket() {
    if (!token) {
        console.error('You need to log in first');
        return;
    }

    websocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/room1/?token=${token}`);

    websocket.onopen = function(event) {
        console.log('WebSocket connected');
    };

    websocket.onerror = function(event) {
        console.error('WebSocket error:', event);
    };

    websocket.onmessage = function(event) {
        const message = JSON.parse(event.data);
        displayMessage(message.username, message.message);
    };
}

async function sendMessage() {
    const message = document.getElementById('message').value;

    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket connection is not open');
        return;
    }

    websocket.send(JSON.stringify({
        message: message
    }));

    document.getElementById('message').value = '';
}

function displayMessage(username, message) {
    const messageContainer = document.createElement('div');
    messageContainer.innerHTML = `<strong>${username}:</strong> ${message}`;
    document.getElementById('messages').appendChild(messageContainer);
}
