# Collaborative Real-Time Note-Taking App

A production-ready, full-stack collaborative note-taking application with real-time synchronization, version history, and a modern UI built with Next.js, Express, MongoDB, and Socket.IO.

## Features

### Core Features
- **Real-Time Collaboration**: Multiple users can edit the same note simultaneously with live updates
- **Rich Text Editor**: Full-featured text editor with formatting options (bold, italic, headings, lists, code blocks)
- **Version History**: Automatic version tracking with ability to preview and restore previous versions
- **Auto-Save**: Notes are automatically saved as you type with debouncing
- **Collaborative Awareness**: See who's online and who's currently typing
- **Modern UI**: Beautiful, responsive interface built with HeroUI (NextUI)
- **Dark Mode Support**: Seamless dark mode integration

### Technical Features
- **WebSocket Communication**: Real-time updates using Socket.IO
- **State Management**: Zustand for efficient client-side state
- **MongoDB Atlas**: Cloud-hosted database for scalability
- **Type-Safe**: Built with TypeScript for reliability
- **Performance Optimized**: Debounced updates, lazy loading, and optimized re-renders

## Tech Stack

### Frontend
- **Framework**: Next.js 13 (App Router)
- **UI Library**: HeroUI (NextUI v2)
- **Rich Text Editor**: TipTap
- **State Management**: Zustand
- **Real-Time Client**: Socket.IO Client
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Formatting**: date-fns

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Real-Time Server**: Socket.IO
- **Authentication**: Simple JWT-based (optional)

## Project Structure

```
collaborative-note-app/
├── backend/                    # Backend Express server
│   ├── config/
│   │   └── database.js        # MongoDB connection config
│   ├── models/
│   │   ├── Note.js           # Note schema with versions
│   │   └── User.js           # User schema
│   ├── routes/
│   │   ├── notes.js          # Note CRUD APIs
│   │   └── users.js          # User APIs
│   ├── server.js             # Express + Socket.IO server
│   ├── package.json
│   └── .env.example
│
├── app/                       # Next.js app directory
│   ├── dashboard/
│   │   └── page.tsx          # Notes dashboard
│   ├── notes/
│   │   └── [id]/
│   │       └── page.tsx      # Note editor page
│   ├── globals.css           # Global styles + TipTap styles
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Home page (redirects)
│   └── providers.tsx         # NextUI & Socket providers
│
├── components/                # React components
│   ├── editor/
│   │   └── RichTextEditor.tsx    # TipTap editor component
│   └── notes/
│       ├── NoteCard.tsx          # Note card for dashboard
│       ├── CollaborationStatus.tsx # Active users display
│       └── VersionHistory.tsx     # Version history modal
│
├── services/                  # Service layer
│   ├── api.ts                # REST API client
│   └── socket.ts             # Socket.IO client wrapper
│
├── store/                     # Zustand stores
│   ├── useNoteStore.ts       # Notes & collaboration state
│   └── useUserStore.ts       # User state
│
└── package.json              # Frontend dependencies
```

## Architecture

### Database Schema

#### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (optional),
  createdAt: Date
}
```

#### Note Schema
```javascript
{
  title: String,
  content: Object (TipTap JSON),
  collaborators: [ObjectId] (User references),
  versions: [
    {
      content: Object,
      editedBy: ObjectId (User reference),
      timestamp: Date
    }
  ],
  createdBy: ObjectId (User reference),
  createdAt: Date,
  updatedAt: Date
}
```

### REST API Endpoints

- `POST /api/notes` - Create a new note
- `GET /api/notes` - Get all notes (optionally filtered by userId)
- `GET /api/notes/:id` - Get a specific note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `GET /api/notes/:id/versions` - Get version history
- `POST /api/notes/:id/restore-version` - Restore a previous version

### WebSocket Events

#### Client → Server
- `join-note` - Join a note room
- `leave-note` - Leave a note room
- `note-update` - Send content changes
- `typing` - Send typing status
- `title-update` - Send title changes

#### Server → Client
- `users-in-room` - List of active users
- `note-update` - Receive content changes
- `user-typing` - Receive typing status
- `title-update` - Receive title changes

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Update the `.env` file with your MongoDB Atlas credentials:
```env
MONGO_URI=mongodb+srv://rakiravi44_db_user:<YOUR_PASSWORD>@cluster0.vdbumlh.mongodb.net/collaborative_notes?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

5. Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the project root directory:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file from the example:
```bash
cp .env.local.example .env.local
```

4. Update the `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

5. Start the Next.js development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

### Running Both Servers

You need to run both the backend and frontend servers simultaneously:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

Then open your browser to `http://localhost:3000`

## Usage

1. **Create a Note**: Click the "New Note" button on the dashboard
2. **Edit a Note**: Click on any note card to open the editor
3. **Rich Text Formatting**: Use the toolbar to format your text
4. **Real-Time Collaboration**: Share the note URL with others to collaborate
5. **View Version History**: Click the "History" button to see all versions
6. **Restore a Version**: Select a version and click "Restore This Version"
7. **Auto-Save**: Your changes are automatically saved every 2 seconds

## Deployment

### Backend Deployment (Render/Railway/Cyclic)

1. Create a new web service
2. Connect your repository
3. Set environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL=<your-frontend-url>`
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Deploy

### Frontend Deployment (Vercel)

1. Import your repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL=<your-backend-url>`
   - `NEXT_PUBLIC_SOCKET_URL=<your-backend-url>`
3. Deploy

The project is configured for Vercel with `netlify.toml` already included.

## Development Notes

### Key Features Implementation

#### Real-Time Collaboration
- Socket.IO manages WebSocket connections
- Each note has its own room for isolated updates
- Debounced updates prevent network flooding
- Conflict resolution uses last-write-wins strategy

#### Version History
- Every save creates a new version entry
- Versions store complete content snapshots
- UI allows preview and restoration
- Restoring creates a new version (non-destructive)

#### Auto-Save
- 2-second debounce for content changes
- 1-second debounce for title changes
- Visual feedback for save status
- Prevents data loss

#### Performance Optimizations
- Debounced editor updates
- Optimistic UI updates
- Zustand for efficient state management
- TipTap for performant rich text editing

## Troubleshooting

### Backend Connection Issues
- Ensure MongoDB Atlas IP whitelist includes your IP (or use 0.0.0.0/0 for development)
- Verify the MongoDB connection string is correct
- Check that the backend server is running on port 5000

### Socket.IO Connection Issues
- Ensure backend is running before starting frontend
- Check CORS configuration in backend/server.js
- Verify NEXT_PUBLIC_SOCKET_URL is correct

### Build Errors
- Run `npm install` in both backend and frontend directories
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`
- Ensure all environment variables are set

## Future Enhancements

- [ ] User authentication with email/password
- [ ] Permissions management (view/edit access)
- [ ] Rich media support (images, videos)
- [ ] Export to PDF/Markdown
- [ ] Note templates
- [ ] Tags and folders
- [ ] Full-text search
- [ ] Commenting system
- [ ] Real-time cursor positions
- [ ] Conflict resolution improvements

## License

MIT

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for collaborative productivity
