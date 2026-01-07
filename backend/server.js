require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL || '*'
      : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

connectDB();

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || '*'
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/notes', require('./routes/notes'));
app.use('/api/users', require('./routes/users'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const activeUsers = new Map();
const noteRooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-note', ({ noteId, userId, userName }) => {
    socket.join(noteId);

    if (!noteRooms.has(noteId)) {
      noteRooms.set(noteId, new Map());
    }

    const room = noteRooms.get(noteId);
    room.set(socket.id, { userId, userName, socketId: socket.id });

    activeUsers.set(socket.id, { noteId, userId, userName });

    const roomUsers = Array.from(room.values());
    io.to(noteId).emit('users-in-room', roomUsers);

    console.log(`User ${userName} joined note ${noteId}`);
  });

  socket.on('note-update', ({ noteId, content, userId, userName }) => {
    socket.to(noteId).emit('note-update', {
      content,
      userId,
      userName,
      timestamp: Date.now()
    });
  });

  socket.on('typing', ({ noteId, userId, userName, isTyping }) => {
    socket.to(noteId).emit('user-typing', {
      userId,
      userName,
      isTyping
    });
  });

  socket.on('cursor-move', ({ noteId, userId, userName, position }) => {
    socket.to(noteId).emit('cursor-update', {
      userId,
      userName,
      position
    });
  });

  socket.on('title-update', ({ noteId, title, userId, userName }) => {
    socket.to(noteId).emit('title-update', {
      title,
      userId,
      userName
    });
  });

  socket.on('leave-note', ({ noteId }) => {
    socket.leave(noteId);

    if (noteRooms.has(noteId)) {
      const room = noteRooms.get(noteId);
      room.delete(socket.id);

      if (room.size === 0) {
        noteRooms.delete(noteId);
      } else {
        const roomUsers = Array.from(room.values());
        io.to(noteId).emit('users-in-room', roomUsers);
      }
    }

    activeUsers.delete(socket.id);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    const userInfo = activeUsers.get(socket.id);
    if (userInfo) {
      const { noteId } = userInfo;

      if (noteRooms.has(noteId)) {
        const room = noteRooms.get(noteId);
        room.delete(socket.id);

        if (room.size === 0) {
          noteRooms.delete(noteId);
        } else {
          const roomUsers = Array.from(room.values());
          io.to(noteId).emit('users-in-room', roomUsers);
        }
      }

      activeUsers.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server, io };
