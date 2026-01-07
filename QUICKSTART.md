# Quick Start Guide

Get the Collaborative Notes app running in 5 minutes!

## What You Need

- Node.js (v16+)
- MongoDB Atlas account (free)
- 2 terminal windows

## Step 1: MongoDB Setup (2 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create account (or sign in)
3. Create a cluster (free M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Replace `<password>` with your database password

Your string should look like:
```
mongodb+srv://rakiravi44_db_user:YOUR_PASSWORD@cluster0.vdbumlh.mongodb.net/collaborative_notes?retryWrites=true&w=majority
```

## Step 2: Backend Setup (1 minute)

Open Terminal 1:

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and paste your MongoDB connection string:
```env
MONGO_URI=mongodb+srv://rakiravi44_db_user:YOUR_PASSWORD@cluster0.vdbumlh.mongodb.net/collaborative_notes?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=change_this_secret
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: cluster0.vdbumlh.mongodb.net
```

## Step 3: Frontend Setup (1 minute)

Open Terminal 2:

```bash
cd ..  # Go back to project root
npm install --legacy-peer-deps
cp .env.local.example .env.local
```

The `.env.local` should have:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000
```

## Step 4: Use the App! (30 seconds)

Open your browser to `http://localhost:3000`

Try these features:
1. Click "New Note" to create a note
2. Type something in the editor
3. Use the formatting toolbar (bold, italic, headings, lists)
4. Click "History" to see version history
5. Open the same note in another tab to see real-time sync!

## Troubleshooting

### Backend won't start?
- Check MongoDB connection string is correct
- Make sure password doesn't have special characters
- Add `0.0.0.0/0` to IP whitelist in MongoDB Atlas

### Frontend shows errors?
- Make sure backend is running first
- Check `.env.local` file exists
- Try: `rm -rf node_modules && npm install --legacy-peer-deps`

### Port already in use?
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill

# Or change port in backend/.env to 5001
# Then update frontend .env.local to use port 5001
```

## What's Next?

- Read [README.md](./README.md) for complete documentation
- Check [SETUP.md](./SETUP.md) for detailed setup guide
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

## Quick Feature Tour

### Dashboard
- View all your notes
- Search notes by title
- Create new notes
- Delete notes

### Note Editor
- Rich text editing with toolbar
- Bold, italic, strikethrough
- Headings (H1, H2)
- Bullet and numbered lists
- Code blocks
- Auto-save every 2 seconds
- Real-time collaboration

### Version History
- View all previous versions
- See who edited and when
- Preview any version
- Restore old versions
- Non-destructive (restoring creates new version)

### Real-Time Features
- See who's online
- Typing indicators
- Live content updates
- Synchronized across all users

## Development Tips

### Hot Reload
Both servers support hot reload - just save your files!

### Database Viewer
Use MongoDB Compass to view your data:
- Connection string: Same as in `.env`
- Collections: `notes`, `users`

### Debug Socket.IO
Check browser console for Socket.IO connection logs:
```javascript
Socket connected: <socket-id>
```

### Check Backend Health
Visit: `http://localhost:5000/api/health`

## Support

Having issues? Check:
1. Both terminals are running
2. MongoDB connection is working
3. Environment files are set correctly
4. Ports 3000 and 5000 are available

Still stuck? See [SETUP.md](./SETUP.md) for detailed troubleshooting.

---

Happy collaborating! 🚀
