# Complete Setup Guide

This guide will help you set up both the backend and frontend of the Collaborative Notes application.

## Prerequisites

Before you begin, ensure you have:
- Node.js v16 or higher installed
- npm or yarn package manager
- A MongoDB Atlas account (free tier works fine)
- A code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Clone and Prepare the Project

```bash
# Navigate to the project directory
cd collaborative-note-app
```

### 2. Backend Setup

#### 2.1 Install Backend Dependencies

```bash
cd backend
npm install
```

#### 2.2 Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create an account or sign in
3. Create a new cluster (free tier is sufficient)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string
7. Replace `<password>` with your database user password
8. The database name should be `collaborative_notes`

Your connection string should look like:
```
mongodb+srv://rakiravi44_db_user:YOUR_PASSWORD@cluster0.vdbumlh.mongodb.net/collaborative_notes?retryWrites=true&w=majority
```

#### 2.3 Create Backend Environment File

```bash
cp .env.example .env
```

Edit the `.env` file and add:
```env
MONGO_URI=mongodb+srv://rakiravi44_db_user:YOUR_PASSWORD@cluster0.vdbumlh.mongodb.net/collaborative_notes?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_random_secret_key_here_change_this
NODE_ENV=development
```

**Important:** Replace `YOUR_PASSWORD` with your actual MongoDB password!

#### 2.4 Start the Backend Server

```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: cluster0.vdbumlh.mongodb.net
```

### 3. Frontend Setup

Open a new terminal window (keep the backend running in the first terminal).

#### 3.1 Navigate to Project Root

```bash
cd ..  # Go back to project root
```

#### 3.2 Install Frontend Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js
- NextUI (HeroUI)
- TipTap
- Socket.IO Client
- Zustand
- And more...

#### 3.3 Create Frontend Environment File

```bash
cp .env.local.example .env.local
```

The `.env.local` file should contain:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

#### 3.4 Start the Frontend Server

```bash
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should be automatically redirected to the dashboard!

## Verification Steps

### Check Backend
1. Open `http://localhost:5000/api/health` in your browser
2. You should see: `{"status":"ok","message":"Server is running"}`

### Check Frontend
1. Open `http://localhost:3000`
2. You should see the dashboard with "My Notes" heading
3. Click "New Note" button
4. You should be redirected to the note editor
5. Try typing - the editor should work
6. Changes should auto-save (watch for "Saved" button)

### Check Real-Time Collaboration
1. Open the same note in two different browser tabs
2. Type in one tab
3. You should see the changes appear in the other tab in real-time
4. Check for "1 user online" indicator

## Common Issues and Solutions

### Issue: Backend won't start - MongoDB connection failed

**Solution:**
1. Check your MongoDB Atlas IP whitelist:
   - Go to MongoDB Atlas → Network Access
   - Add `0.0.0.0/0` for testing (allows all IPs)
   - For production, use specific IPs
2. Verify your connection string is correct
3. Ensure your password doesn't contain special characters (or URL-encode them)

### Issue: Frontend shows errors about missing modules

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Socket.IO not connecting

**Solution:**
1. Ensure backend is running on port 5000
2. Check `.env.local` has correct Socket URL
3. Try restarting both servers
4. Check browser console for CORS errors

### Issue: Port 5000 already in use

**Solution:**
```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill

# Or change the port in backend/.env
PORT=5001
```

Then update frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Rebuild the project
npm run build
```

## Running in Production

### Backend
```bash
cd backend
NODE_ENV=production npm start
```

### Frontend
```bash
npm run build
npm start
```

## Development Tips

### Hot Reload
- Both servers support hot reload
- Changes to frontend code reload automatically
- Backend uses nodemon for auto-restart

### Debugging
- Backend logs appear in terminal 1
- Frontend logs appear in terminal 2 and browser console
- Socket.IO events logged in both server and client

### Database Management
- Use MongoDB Compass to view your data
- Connection string is the same as in `.env`
- Database name: `collaborative_notes`
- Collections: `notes`, `users`

## Next Steps

Once everything is working:
1. Create some test notes
2. Try the rich text editor features
3. Test version history
4. Open notes in multiple tabs to test real-time sync
5. Explore the codebase structure

## Need Help?

If you encounter issues not covered here:
1. Check the main README.md
2. Check backend/README.md
3. Review console logs for error messages
4. Ensure all environment variables are set correctly

## Success Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB Atlas connected
- [ ] Can create new notes
- [ ] Can edit notes
- [ ] Auto-save works
- [ ] Real-time sync works between tabs
- [ ] Version history works

Congratulations! Your collaborative note-taking app is ready to use!
