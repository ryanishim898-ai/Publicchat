// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDy8h-5zJ0z3Q4K8wJ7zL5zQ9zZ0zJ7zL5",
    authDomain: "public-chat-sync.firebaseapp.com",
    databaseURL: "https://public-chat-sync-default-rtdb.firebaseio.com",
    projectId: "public-chat-sync",
    storageBucket: "public-chat-sync.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcd"
};

// Initialize Firebase
let db;
let currentUser = '';
let messagesRef;

try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    messagesRef = db.ref('publicChat/messages');
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase init error:', error);
}

// Login function
function login() {
    const usernameInput = document.getElementById('usernameInput');
    const username = usernameInput.value.trim();

    if (!username) {
        alert('Please enter a username');
        return;
    }

    currentUser = username;
    console.log('Logged in as:', currentUser);
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('chatSection').style.display = 'flex';
    document.getElementById('currentUser').textContent = `You: ${username}`;
    
    document.getElementById('messageInput').focus();
    
    // Start listening for messages
    startListeningToMessages();
}

// Start listening to messages in real-time
function startListeningToMessages() {
    messagesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            displayMessages(data);
        } else {
            displayMessages({});
        }
    });
}

// Send message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();

    if (!messageText || !currentUser) {
        return;
    }

    const message = {
        username: currentUser,
        text: messageText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        id: Date.now()
    };

    // Push to Firebase
    messagesRef.child(message.id).set(message)
        .then(() => {
            console.log('Message sent:', message);
            messageInput.value = '';
            messageInput.focus();
        })
        .catch(error => {
            console.error('Error sending message:', error);
            alert('Error sending message. Check your connection.');
        });
}

// Display all messages
function displayMessages(messagesObj) {
    const messagesContainer = document.getElementById('messagesContainer');
    
    if (!messagesContainer) return;

    messagesContainer.innerHTML = '';

    if (!messagesObj || Object.keys(messagesObj).length === 0) {
        messagesContainer.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">No messages yet. Start chatting!</div>';
        return;
    }

    // Convert to array and sort by timestamp
    const messagesArray = Object.values(messagesObj).sort((a, b) => a.id - b.id);

    messagesArray.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = msg.username === currentUser ? 'message own' : 'message other';
        
        const messageHTML = `
            <div class="message-content">
                <div>
                    <div class="message-text">
                        <strong>${escapeHtml(msg.username)}:</strong> ${escapeHtml(msg.text)}
                    </div>
                    <div class="message-info">${msg.timestamp}</div>
                </div>
            </div>
        `;
        
        messageDiv.innerHTML = messageHTML;
        messagesContainer.appendChild(messageDiv);
    });

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Logout function
function logout() {
    currentUser = '';
    if (messagesRef) {
        messagesRef.off();
    }
    document.getElementById('chatSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('usernameInput').value = '';
    document.getElementById('usernameInput').focus();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Handle Enter key press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
}

// Initialize on load
window.addEventListener('load', () => {
    console.log('Page loaded');
    document.getElementById('usernameInput').focus();
});
