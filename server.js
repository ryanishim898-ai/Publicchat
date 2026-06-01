const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// In-memory storage
let messages = [];

// GET all messages
app.get('/api/messages', (req, res) => {
    res.json({ messages });
});

// POST new message
app.post('/api/messages', (req, res) => {
    const { username, text, timestamp, id } = req.body;

    if (!username || !text) {
        return res.status(400).json({ error: 'Missing username or text' });
    }

    const message = { username, text, timestamp, id };
    messages.push(message);

    // Keep only last 500 messages
    if (messages.length > 500) {
        messages.shift();
    }

    console.log('Message added:', message);
    res.json({ success: true, message });
});

// DELETE all messages (optional)
app.delete('/api/messages', (req, res) => {
    messages = [];
    res.json({ success: true, message: 'All messages cleared' });
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✅ Chat Server Running!`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`🌐 Network: http://YOUR_IP:${PORT}`);
    console.log(`\nMessages API: http://localhost:${PORT}/api/messages\n`);
});
