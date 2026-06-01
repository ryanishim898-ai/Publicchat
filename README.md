# Public Chat System

A simple, real-time public chat application where multiple users can send and receive messages.

## Features

- **Username Login**: Enter any username to join the chat
- **Public Chat**: All users see the same messages
- **Send Messages**: Type and send messages instantly with a Send button
- **Real-time Updates**: Messages refresh automatically
- **Timestamps**: Every message shows when it was sent
- **Local Storage**: Messages persist between sessions
- **Simple UI**: Clean, responsive design
- **Mobile Friendly**: Works on all devices

## How to Use

1. Open `index.html` in your web browser
2. Enter a username
3. Click "Login"
4. Type your message in the text field
5. Click "Send" or press Enter
6. See all messages from all users in the chat area
7. Click "Logout" to switch users

## How It Works

- Messages are stored in your browser's **localStorage**
- All open tabs/windows share the same message database
- Messages persist even after closing the browser
- Multiple users can be logged in from different browsers/devices

## Files

- `index.html` - Main HTML structure with username input and chat interface
- `style.css` - Styling and responsive design
- `script.js` - Chat functionality and message management
- `README.md` - This file

## No Backend Required

This is a pure HTML/CSS/JavaScript application. No server or database needed - everything runs locally in your browser!

## Clear Chat

To clear all messages, open your browser's developer console and run:
```javascript
localStorage.removeItem('publicChatMessages');
```
