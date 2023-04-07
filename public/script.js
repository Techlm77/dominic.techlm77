// Create a new WebSocket object to connect to the server
const websocket = new WebSocket('wss://' + window.location.hostname + ':8443/ws');

// Add an event listener for when the WebSocket connection is opened
websocket.addEventListener('open', () => {
    console.log('Connected to server');

    // Display a message to indicate the connection status
    MessageAdd('<div class="message green">Connected from wss://' + window.location.hostname + ':8443/ws</div>');
    MessageAdd('<div class="message green">You have entered the chat room.</div>');

    // Display the user's username if it exists, otherwise prompt the user to enter a username
    if (localStorage.getItem('username')) {
        MessageAdd('<div class="message">Welcome, ' + localStorage.getItem('username') + '</div>');
    } else {
        setUsername();
    }

    // Define the auto message to send
    const autoMessage = 'Hello, I have joined the chat room!';

    // Sanitize the message and username
    const username = localStorage.getItem('username');
    const sanitizedMessage = sanitize(autoMessage);
    const sanitizedUsername = sanitize(username);

    // Construct the message data
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const data = `${hours}:${minutes} - ${sanitizedUsername}: ${sanitizedMessage}`;

    // Send the message to the server
    websocket.send(data);
});

// Add an event listener for when the WebSocket connection is closed
websocket.addEventListener('close', () => {
    console.log('Disconnected from server');

    // Display a message to indicate the connection status
    MessageAdd('<div class="message blue">You have been disconnected.</div>');
});

// Add an event listener for when a WebSocket error occurs
websocket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);

    // Display a message to indicate the connection status
    MessageAdd('<div class="message red">Connection to chat failed.</div>');
});

// If notificationsEnabled is true, you can display a notification. If it is false, you can skip displaying the notification.
function isNotificationEnabled() {
    if (!('Notification' in window)) { // Check if notifications are supported in the browser
        console.warn('Notifications not supported in this browser');
        return false;
    } else if (Notification.permission === 'granted') { // Check if permission has already been granted
        return true;
    } else if (Notification.permission !== 'denied') { // Check if permission has not yet been granted or denied
        Notification.requestPermission().then(permission => { // Request permission
            if (permission === 'granted') { // If permission is granted
                return true;
            } else { // If permission is denied
                console.warn('User denied notification permission');
                return false;
            }
        });
    } else { // If permission has already been denied
        console.warn('User has denied notification permission');
        return false;
    }
}

// Function to set the user's username
function setUsername() {
    const bannedUsernames = ['adolf hitler', 'shit', 'fuck', 'fucking', 'asshole', 'dick', 'dickhead', 'twat', 'pussy', 'douche', 'moron'];
    let username = window.prompt('Enter your username:', '');

    // Check that the username is at least two characters long and not null or empty
    if (username && username.trim().length > 2) {
        // Check if the username contains any banned words
        const bannedWordPattern = new RegExp(`\\b(${bannedUsernames.join('|')})\\b`, 'i');
        if (bannedWordPattern.test(username)) {
            username = Math.random().toString(36).substr(2, 5); // Generate a random username
            console.log('Banned username detected. Changing username to', username);
        }
        localStorage.setItem('username', username.trim());

        // Display a message to indicate the user's username has been set
        MessageAdd(`<div class="message">Welcome, ${localStorage.getItem('username')}</div>`);
    } else {
        alert('Your username must be at least two characters.');
        setUsername();
    }
}

// Add an event listener for when a message is received from the server
websocket.addEventListener('message', (event) => {
    // Parse the message data and display the message in the chat window
    const messageText = event.data;
    const messageType = 'message';
    if (messageType === 'message') {
        const sanitizedMessageText = sanitize(messageText);
        const messageWithLinks = makeLinksClickable(sanitizedMessageText);
        MessageAdd('<div class="message">' + messageWithLinks + '</div>');

        // Display a notification if the chat window is not in focus
        if (!document.hasFocus() && isNotificationEnabled()) {
            new Notification('New message', {
                body: sanitizedMessageText,
                icon: 'favicon.ico'
            });
        }
    }

});

// Define an array of banned words
const bannedWords = ['shit', 's h i t', 'fuck', 'f u c k', 'asshole', 'a s s h o l e', 'dick', 'd i c k', 'twat', 't w a t', 'pussy', 'p u s s y', 'douche', 'd o u c h e', 'heck', 'h e c k', 'cunt', 'c u n t', 'nigger', 'n i g g e r', 'faggot', 'f a g g o t', 'tranny', 't r a n n y', 'retard', 'r e t a r d', 'piss', 'p i s s', 'arse', 'a r s e', 'bugger', 'b u g g e r'];

// Add an event listener for when the chat form is submitted
document.getElementById('chat-form').addEventListener('submit', (event) => {
    event.preventDefault();

    // Get the message input and trim whitespace from the message
    const message_element = document.getElementsByTagName('input')[0];
    const message = message_element.value.trim();
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    // If the message is not empty, sanitize the message and username and send it to the server
    if (message.length) {
        const username = localStorage.getItem('username');
        const sanitizedMessage = sanitize(message);
        const sanitizedUsername = sanitize(username);

        // Replace all banned words with a randomized version
        const data = `${hours}:${minutes} - ${sanitizedUsername}: ${sanitizedMessage.replace(new RegExp(bannedWords.join('|'), 'gi'), match => {
            const length = match.length;
            return Array.from({ length }, () => String.fromCharCode(Math.random() * 26 + 97)).join('');
        })}`;

        websocket.send(data);

        // Clear the message input field
        message_element.value = '';
    }
});

// Add an event listener for the disconnect button
document.getElementById('disconnect-button').addEventListener('click', () => {
    websocket.close();
});

// Add an event listener for the username button to prompt the user to set a new username
document.getElementById('username-button').addEventListener('click', () => {
    localStorage.removeItem('username');
    setUsername();
});

// Add an event listener for the help button to display a help message
document.getElementById('help-button').addEventListener('click', () => {
    MessageAdd('<div class="message">Type your message in the input box and press enter or click send to send a message.</div>');
    MessageAdd('<div class="message">Click the username button to set a new username.</div>');
    MessageAdd('<div class="message">Click the disconnect button to disconnect from the chat room.</div>');
    MessageAdd('<div class="message">Click check for Notification to ask if you want to allow notification when receiving messages.</div>');
});

// Function to sanitize user input to prevent cross-site scripting attacks
function sanitize(input) {
    const temp = document.createElement('div');
    temp.textContent = input;
    return temp.innerHTML;
}

// Function to add a message to the chat window
const chat_messages = document.getElementById('chat-messages');
const messageContainer = document.createElement('div');
messageContainer.classList.add('fade-in');

function MessageAdd(message) {
    messageContainer.innerHTML = message;
    chat_messages.appendChild(messageContainer.cloneNode(true));
    chat_messages.scrollTop = chat_messages.scrollHeight;
}

// Function to make links in messages clickable
function makeLinksClickable(message) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return message.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
}