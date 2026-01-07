# Backend Server - Collaborative Notes API

Express.js server with Socket.IO for real-time collaboration and MongoDB for data persistence.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB credentials:
```env
MONGO_URI=mongodb+srv://rakiravi44_db_user:<YOUR_PASSWORD>@cluster0.vdbumlh.mongodb.net/collaborative_notes
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev  # Development with auto-reload
npm start    # Production
```

## API Endpoints

### Notes
- `POST /api/notes` - Create note
- `GET /api/notes` - List notes
- `GET /api/notes/:id` - Get note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/:id/versions` - Get versions
- `POST /api/notes/:id/restore-version` - Restore version

### Users
- `POST /api/users` - Create user
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user

### Health Check
- `GET /api/health` - Server status

## Socket.IO Events

### Client Events
- `join-note` - Join a note room
- `leave-note` - Leave a note room
- `note-update` - Update note content
- `typing` - Typing indicator
- `title-update` - Update note title

### Server Events
- `users-in-room` - Active users list
- `note-update` - Content update broadcast
- `user-typing` - Typing status broadcast
- `title-update` - Title update broadcast

## Environment Variables

- `MONGO_URI` - MongoDB Atlas connection string
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret for JWT tokens
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (production)

## Project Structure

```
backend/
├── config/
│   └── database.js       # MongoDB connection
├── models/
│   ├── Note.js          # Note schema
│   └── User.js          # User schema
├── routes/
│   ├── notes.js         # Note routes
│   └── users.js         # User routes
├── server.js            # Main server file
├── package.json
└── .env.example
```

## MongoDB Schema

### Note
```javascript
{
  title: String,
  content: Object,
  collaborators: [ObjectId],
  versions: [
    {
      content: Object,
      editedBy: ObjectId,
      timestamp: Date
    }
  ],
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  createdAt: Date
}
```

## Deployment

### Render
1. Create new Web Service
2. Connect repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables
6. Deploy

### Railway
1. Create new project
2. Connect repository
3. Set root directory: `backend`
4. Add environment variables
5. Deploy

### Cyclic
1. Connect repository
2. Set environment variables
3. Deploy

## Troubleshooting

**MongoDB Connection Failed:**
- Check IP whitelist in MongoDB Atlas
- Verify connection string format
- Ensure password is URL-encoded

**Socket.IO Connection Issues:**
- Check CORS configuration
- Verify frontend URL is whitelisted
- Check firewall settings

**Port Already in Use:**
- Change PORT in .env file
- Kill process using port 5000: `lsof -ti:5000 | xargs kill`
