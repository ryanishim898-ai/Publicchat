let currentUser = '';
let messages = [];
let refreshInterval;

// Load messages from localStorage
function loadMessages() {
    try {
        const saved = localStorage.getItem('publicChatMessages');
        messages = saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Error loading messages:', e);
        messages = [];
    }
}

// Save messages to localStorage
function saveMessages() {
    try {
        localStorage.setItem('publicChatMessages', JSON.stringify(messages));
        console.log('Messages saved:', messages);
    } catch (e) {
        console.error('Error saving messages:', e);
        alert('Error saving message. Storage may be full.');
    }
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
    
    loadMessages();
    displayMessages();
    document.getElementById('messageInput').focus();

    // Refresh messages every 1000ms
    refreshInterval = setInterval(() => {
        loadMessages();
        displayMessages();
    }, 1000);
}

// Logout function
function logout() {
    currentUser = '';
    clearInterval(refreshInterval);
    document.getElementById('chatSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('usernameInput').value = '';
    document.getElementById('usernameInput').focus();
    messages = [];
}

// Send message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();

    console.log('Send message clicked. Text:', messageText, 'Current user:', currentUser);

    if (!messageText || !currentUser) {
        console.log('Prevented: empty message or no user logged in');
        return;
    }

    const message = {
        username: currentUser,
        text: messageText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    messages.push(message);
    console.log('Message added:', message);
    saveMessages();
    
    messageInput.value = '';
    displayMessages();
    messageInput.focus();
}

// Display all messages
function displayMessages() {
    const messagesContainer = document.getElementById('messagesContainer');
    
    if (!messagesContainer) {
        console.error('Messages container not found');
        return;
    }

    messagesContainer.innerHTML = '';

    if (!messages || messages.length === 0) {
        messagesContainer.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">No messages yet. Start chatting!</div>';
        return;
    }

    messages.forEach((msg, index) => {
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
    loadMessages();
    const usernameInput = document.getElementById('usernameInput');
    if (usernameInput) {
        usernameInput.focus();
    }
});
