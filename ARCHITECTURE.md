# Architecture Documentation

## System Overview

This is a full-stack collaborative note-taking application with real-time synchronization capabilities. The system consists of three main layers: Frontend (Next.js), Backend (Express.js), and Database (MongoDB Atlas).

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Next.js Frontend (Port 3000)                  │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  UI Layer (NextUI/HeroUI Components)                │  │ │
│  │  │  - Dashboard Page                                    │  │ │
│  │  │  - Note Editor Page                                  │  │ │
│  │  │  - Version History Modal                             │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  State Management (Zustand)                          │  │ │
│  │  │  - useNoteStore: Notes, active users, typing status │  │ │
│  │  │  - useUserStore: Current user info                  │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  Services Layer                                      │  │ │
│  │  │  - API Service: REST API calls                      │  │ │
│  │  │  - Socket Service: WebSocket communication          │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  TipTap Rich Text Editor                            │  │ │
│  │  │  - StarterKit extensions                            │  │ │
│  │  │  - Custom formatting toolbar                        │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST (Port 5000)
                            │ WebSocket/Socket.IO (Port 5000)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              Backend Server (Express.js + Socket.IO)            │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  REST API Layer (Express Routes)                          │ │
│  │  - /api/notes/* : Note CRUD operations                    │ │
│  │  - /api/users/* : User management                         │ │
│  │  - /api/health : Health check endpoint                    │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  WebSocket Layer (Socket.IO)                              │ │
│  │  - Room Management: Note-based rooms                      │ │
│  │  - Event Handlers: join-note, leave-note, note-update    │ │
│  │  - Broadcasting: Real-time updates to all room members   │ │
│  │  - User Tracking: Active users per note                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Database Access Layer (Mongoose ODM)                     │ │
│  │  - Note Model: CRUD + Version Management                  │ │
│  │  - User Model: User operations                            │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ MongoDB Protocol
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas (Cloud)                        │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Database: collaborative_notes                             │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  Collection: notes                                   │  │ │
│  │  │  - Documents with embedded versions array            │  │ │
│  │  │  - References to users (collaborators, createdBy)    │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  Collection: users                                   │  │ │
│  │  │  - User profiles and credentials                     │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Note Creation Flow
```
User clicks "New Note"
  → Frontend: Call api.createNote()
  → Backend: POST /api/notes
  → MongoDB: Insert new note document
  → Backend: Return note with ID
  → Frontend: Navigate to /notes/[id]
  → Socket.IO: Join note room
  → Backend: Broadcast user joined
```

### Real-Time Update Flow
```
User types in editor
  → Frontend: TipTap onChange event
  → Frontend: Update local state (optimistic)
  → Frontend: Emit note-update via Socket.IO
  → Backend: Broadcast to all users in room (except sender)
  → Other Clients: Receive note-update event
  → Other Clients: Update their editors
  → Frontend: Debounced save to database (2s)
  → Backend: PUT /api/notes/:id
  → MongoDB: Update note + add version
```

### Version History Flow
```
User clicks "History"
  → Frontend: Open modal, call api.getVersions()
  → Backend: GET /api/notes/:id/versions
  → MongoDB: Return versions array
  → Frontend: Display version list
User selects version
  → Frontend: Display version preview
User clicks "Restore"
  → Frontend: Call api.restoreVersion()
  → Backend: POST /api/notes/:id/restore-version
  → MongoDB: Update note content, add new version entry
  → Backend: Return updated note
  → Frontend: Update editor with restored content
  → Socket.IO: Broadcast update to all users
```

## Component Architecture

### Frontend Components Hierarchy

```
App
├── Providers (NextUI, Theme, Socket Init)
│   ├── Dashboard Page
│   │   ├── Search Input
│   │   ├── Create Note Button
│   │   └── Note Cards Grid
│   │       └── NoteCard (x N)
│   │           ├── Title & Preview
│   │           ├── Collaborators Avatars
│   │           └── Delete Button
│   │
│   └── Note Editor Page
│       ├── Navigation Bar
│       │   ├── Back Button
│       │   ├── Collaboration Status
│       │   ├── History Button
│       │   └── Save Button
│       ├── Title Input
│       ├── Rich Text Editor
│       │   ├── Formatting Toolbar
│       │   └── TipTap Content Area
│       └── Version History Modal
│           ├── Version List
│           ├── Version Preview
│           └── Restore Button
```

## State Management Strategy

### Zustand Stores

#### NoteStore
- **Purpose**: Manage notes collection and collaboration state
- **State**:
  - `notes[]`: Array of all notes
  - `currentNote`: Currently open note
  - `activeUsers[]`: Users currently in the note room
  - `typingUsers: Set`: Users currently typing
  - `isLoading`: Loading state
  - `error`: Error messages

#### UserStore
- **Purpose**: Manage current user information
- **State**:
  - `userId`: Unique user identifier
  - `userName`: Display name
  - `userEmail`: User email
- **Persistence**: LocalStorage via zustand/middleware

## Real-Time Collaboration Architecture

### Room Management
- Each note has its own Socket.IO room (identified by noteId)
- Users join a room when opening a note
- Users leave the room when closing the note
- Server tracks active users per room

### Conflict Resolution
- **Strategy**: Last Write Wins (LWW)
- **Reasoning**: Simple, predictable, works for most use cases
- **Future Enhancement**: Operational Transformation (OT) or CRDT

### Event Broadcasting
```javascript
// User A types
Client A → Server: emit('note-update', { noteId, content })
Server → All clients except A: emit('note-update', { content })
Client B, C, D: Update their editors
```

### Typing Indicators
- Debounced to avoid excessive events
- 1-second timeout after user stops typing
- Visual indicator shows who's typing
- Color-coded avatars for active typers

## Security Considerations

### Current Implementation
- CORS configured for specific origins
- MongoDB connection over TLS
- Input validation on API endpoints
- No authentication (demo mode)

### Production Recommendations
- Implement JWT-based authentication
- Add role-based access control (RBAC)
- Implement rate limiting
- Add request validation middleware
- Use helmet.js for security headers
- Implement proper session management
- Add CSRF protection
- Sanitize user input (XSS prevention)

## Performance Optimizations

### Frontend
- Debounced auto-save (2s for content, 1s for title)
- Debounced socket events
- Zustand for efficient re-renders
- TipTap's virtual DOM for editor performance
- Lazy loading of components
- Optimistic UI updates

### Backend
- Indexed MongoDB queries (on _id, collaborators)
- Connection pooling with Mongoose
- Efficient Socket.IO room management
- Minimal data transfer (only changed content)

### Database
- Compound indexes on frequently queried fields
- Embedded versions (faster than separate collection)
- Lean queries where possible
- Projection to limit returned fields

## Scalability Considerations

### Current Limitations
- Single server instance
- In-memory Socket.IO room management
- No horizontal scaling

### Scaling Strategy
1. **Load Balancing**: Add multiple backend instances behind a load balancer
2. **Socket.IO Adapter**: Use Redis adapter for multi-server Socket.IO
3. **Database Sharding**: Shard MongoDB by note ID
4. **Caching**: Add Redis cache for frequently accessed notes
5. **CDN**: Serve static assets via CDN
6. **Microservices**: Split into separate services (API, WebSocket, Auth)

## Monitoring and Logging

### Recommended Tools
- **Frontend**: Sentry for error tracking
- **Backend**: Morgan for HTTP logging, Winston for application logs
- **Database**: MongoDB Atlas monitoring
- **Real-Time**: Socket.IO admin UI
- **Performance**: New Relic or Datadog

## Deployment Architecture

### Development
```
localhost:3000 (Frontend) → localhost:5000 (Backend) → MongoDB Atlas
```

### Production
```
Vercel (Frontend) → Render/Railway (Backend) → MongoDB Atlas
      ↓                        ↓
   CDN (Static)           Load Balancer
```

## Technology Justification

### Why Next.js?
- Server-side rendering for SEO
- File-based routing
- API routes option
- Great developer experience
- Built-in optimizations

### Why Express.js?
- Lightweight and flexible
- Large ecosystem
- Easy to integrate Socket.IO
- Well-documented

### Why Socket.IO?
- Reliable WebSocket with fallbacks
- Room management built-in
- Reconnection handling
- Browser compatibility

### Why MongoDB?
- Flexible schema for note content
- Easy to embed versions
- Good performance for document storage
- Atlas provides easy cloud hosting

### Why Zustand?
- Lightweight (1kb)
- Simple API
- No boilerplate
- Great TypeScript support
- Built-in persistence

### Why TipTap?
- Headless editor (full UI control)
- Built on ProseMirror (solid foundation)
- Great React integration
- Extensible
- Active development

## Future Architecture Enhancements

1. **Microservices Split**
   - Auth Service
   - Notes Service
   - Real-Time Service
   - Notification Service

2. **Event-Driven Architecture**
   - Message queue (RabbitMQ/Kafka)
   - Event sourcing for version history
   - CQRS pattern for read/write separation

3. **Advanced Collaboration**
   - CRDT-based conflict resolution
   - Real-time cursor positions
   - Presence awareness
   - Commenting and suggestions

4. **Caching Layer**
   - Redis for session storage
   - Cache frequently accessed notes
   - Rate limiting with Redis

5. **Search Infrastructure**
   - Elasticsearch for full-text search
   - Autocomplete suggestions
   - Tag-based filtering

This architecture provides a solid foundation for a production-ready collaborative note-taking application with clear paths for future enhancements and scaling.
