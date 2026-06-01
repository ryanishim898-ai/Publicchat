let currentUser = '';
let messages = [];
let refreshInterval;

// Load messages from localStorage
function loadMessages() {
    const saved = localStorage.getItem('publicChatMessages');
    messages = saved ? JSON.parse(saved) : [];
}

// Save messages to localStorage
function saveMessages() {
    localStorage.setItem('publicChatMessages', JSON.stringify(messages));
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
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('chatSection').style.display = 'flex';
    document.getElementById('currentUser').textContent = `You: ${username}`;
    
    loadMessages();
    displayMessages();
    document.getElementById('messageInput').focus();

    // Refresh messages every 500ms for real-time effect
    refreshInterval = setInterval(() => {
        loadMessages();
        displayMessages();
    }, 500);
}

// Logout function
function logout() {
    currentUser = '';
    clearInterval(refreshInterval);
    document.getElementById('chatSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('usernameInput').value = '';
    document.getElementById('usernameInput').focus();
}

// Send message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();

    if (!messageText) {
        return;
    }

    const message = {
        username: currentUser,
        text: messageText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    messages.push(message);
    saveMessages();
    messageInput.value = '';
    displayMessages();
    messageInput.focus();
}

// Display all messages
function displayMessages() {
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.innerHTML = '';

    messages.forEach(msg => {
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
        sendMessage();
    }
}

// Initialize on load
window.addEventListener('load', () => {
    loadMessages();
    document.getElementById('usernameInput').focus();
});