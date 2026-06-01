let currentUser = '';
let pollInterval;
const API_URL = '/api';

// Login function
function login() {
    const usernameInput = document.getElementById('usernameInput');
    const username = usernameInput.value.trim();

    if (!username) {
        alert('Please enter a username');
        return;
    }

    currentUser = username;
    console.log('✅ Logged in as:', currentUser);
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('chatSection').style.display = 'flex';
    document.getElementById('currentUser').textContent = `You: ${username}`;
    
    // Start polling for messages every 300ms
    pollMessages();
    pollInterval = setInterval(pollMessages, 300);
    
    document.getElementById('messageInput').focus();
}

// Poll messages from server
async function pollMessages() {
    try {
        const response = await fetch(`${API_URL}/messages`);
        if (response.ok) {
            const data = await response.json();
            displayMessages(data.messages || []);
        }
    } catch (error) {
        console.error('❌ Error fetching messages:', error);
    }
}

// Send message
async function sendMessage() {
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

    try {
        const response = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message)
        });

        if (response.ok) {
            console.log('✅ Message sent:', message.text);
            messageInput.value = '';
            messageInput.focus();
            // Refresh immediately to show message
            await pollMessages();
        } else {
            alert('Error sending message');
        }
    } catch (error) {
        console.error('❌ Error sending message:', error);
        alert('Error sending message. Check your connection.');
    }
}

// Display all messages
function displayMessages(messagesArray) {
    const messagesContainer = document.getElementById('messagesContainer');
    
    if (!messagesContainer) return;

    messagesContainer.innerHTML = '';

    if (!messagesArray || messagesArray.length === 0) {
        messagesContainer.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">No messages yet. Start chatting!</div>';
        return;
    }

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
    clearInterval(pollInterval);
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
    console.log('🚀 Chat app loaded');
    document.getElementById('usernameInput').focus();
});
