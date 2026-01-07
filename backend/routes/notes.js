const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const User = require('../models/User');

const mongoose = require('mongoose');

router.post('/', async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    let user;
    // Check if userId is a valid ObjectId or a temporary string ID
    if (mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId);
    } else {
      // If it's not a valid ObjectId, try to find by email or create a demo user
      user = await User.findOne({ email: `user${userId}@demo.com` });
    }
    
    if (!user) {
      // If user doesn't exist, create a user with a temporary ID but proper name
      // This might happen if the user ID was created without proper registration
      user = await User.create({
        name: userId.startsWith('user_') ? `User ${userId.split('_')[1]}` : userId,
        email: `user${userId}@demo.com`
      });
    }

    const note = new Note({
      title: title || 'Untitled Note',
      content: content || {},
      createdBy: user._id,
      collaborators: [user._id],
      versions: [{
        content: content || {},
        editedBy: user._id,
        timestamp: new Date()
      }]
    });

    await note.save();
    await note.populate('createdBy collaborators', 'name email');

    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    let query = {};
    if (userId) {
      // Check if userId is a valid ObjectId or a temporary string ID
      if (mongoose.Types.ObjectId.isValid(userId)) {
        query = { collaborators: userId };
      } else {
        // If it's a temporary string ID, find the user first
        const user = await User.findOne({ email: `user${userId}@demo.com` });
        if (user) {
          query = { collaborators: user._id };
        } else {
          // If no user found, return empty array
          res.json([]);
          return;
        }
      }
    }
    
    const notes = await Note.find(query)
      .populate('createdBy collaborators', 'name email')
      .sort({ updatedAt: -1 });

    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('createdBy collaborators', 'name email')
      .populate('versions.editedBy', 'name email');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    let user;
    // Check if userId is a valid ObjectId or a temporary string ID
    if (mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId);
    } else {
      // If it's not a valid ObjectId, try to find by email or create a demo user
      user = await User.findOne({ email: `user${userId}@demo.com` });
    }
    
    if (!user) {
      // If user doesn't exist, create a user with a temporary ID but proper name
      // This might happen if the user ID was created without proper registration
      user = await User.create({
        name: userId.startsWith('user_') ? `User ${userId.split('_')[1]}` : userId,
        email: `user${userId}@demo.com`
      });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) {
      note.content = content;
      note.versions.push({
        content,
        editedBy: user._id,
        timestamp: new Date()
      });
    }

    await note.save();
    await note.populate('createdBy collaborators', 'name email');

    res.json(note);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id/versions', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('versions.editedBy', 'name email')
      .select('versions');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note.versions.reverse());
  } catch (error) {
    console.error('Get versions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/:id/restore-version', async (req, res) => {
  try {
    const { versionId, userId } = req.body;

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const version = note.versions.id(versionId);
    if (!version) {
      return res.status(404).json({ message: 'Version not found' });
    }

    let user;
    // Check if userId is a valid ObjectId or a temporary string ID
    if (mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId);
    } else {
      // If it's not a valid ObjectId, try to find by email or create a demo user
      user = await User.findOne({ email: `user${userId}@demo.com` });
    }
    
    if (!user) {
      // If user doesn't exist, create a user with a temporary ID but proper name
      // This might happen if the user ID was created without proper registration
      user = await User.create({
        name: userId.startsWith('user_') ? `User ${userId.split('_')[1]}` : userId,
        email: `user${userId}@demo.com`
      });
    }

    note.content = version.content;
    note.versions.push({
      content: version.content,
      editedBy: user._id,
      timestamp: new Date()
    });

    await note.save();
    await note.populate('createdBy collaborators', 'name email');

    res.json(note);
  } catch (error) {
    console.error('Restore version error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Endpoint to invite collaborators to a note
router.post('/:id/invite', async (req, res) => {
  try {
    const { email } = req.body;
    const noteId = req.params.id;
    
    // Find the user by email
    let user = await User.findOne({ email });
    if (!user) {
      // If user doesn't exist, create a new user
      user = await User.create({
        name: email.split('@')[0], // Use part of email as name
        email,
        password: Math.random().toString(36).slice(-8) // Generate a random password
      });
    }
    
    // Find the note
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if user is already a collaborator
    if (note.collaborators.includes(user._id)) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }
    
    // Add user as collaborator
    note.collaborators.push(user._id);
    await note.save();
    
    // Populate and return updated note
    await note.populate('createdBy collaborators', 'name email');
    
    res.json({
      message: 'User invited successfully',
      note
    });
  } catch (error) {
    console.error('Invite collaborator error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
