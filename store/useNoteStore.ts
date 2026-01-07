import { create } from 'zustand';

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Version {
  _id: string;
  content: any;
  editedBy: User;
  timestamp: string;
}

export interface Note {
  _id: string;
  title: string;
  content: any;
  collaborators: User[];
  versions: Version[];
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface ActiveUser {
  userId: string;
  userName: string;
  socketId: string;
}

interface NoteStore {
  notes: Note[];
  currentNote: Note | null;
  activeUsers: ActiveUser[];
  typingUsers: Set<string>;
  isLoading: boolean;
  error: string | null;

  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (noteId: string, updates: Partial<Note>) => void;
  deleteNote: (noteId: string) => void;
  setCurrentNote: (note: Note | null) => void;
  setActiveUsers: (users: ActiveUser[]) => void;
  addTypingUser: (userId: string) => void;
  removeTypingUser: (userId: string) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearStore: () => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  currentNote: null,
  activeUsers: [],
  typingUsers: new Set(),
  isLoading: false,
  error: null,

  setNotes: (notes) => set({ notes }),

  addNote: (note) =>
    set((state) => ({ notes: [note, ...state.notes] })),

  updateNote: (noteId, updates) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note._id === noteId ? { ...note, ...updates } : note
      ),
      currentNote:
        state.currentNote?._id === noteId
          ? { ...state.currentNote, ...updates }
          : state.currentNote,
    })),

  deleteNote: (noteId) =>
    set((state) => ({
      notes: state.notes.filter((note) => note._id !== noteId),
      currentNote: state.currentNote?._id === noteId ? null : state.currentNote,
    })),

  setCurrentNote: (note) => set({ currentNote: note }),

  setActiveUsers: (users) => set({ activeUsers: users }),

  addTypingUser: (userId) =>
    set((state) => {
      const newTypingUsers = new Set(state.typingUsers);
      newTypingUsers.add(userId);
      return { typingUsers: newTypingUsers };
    }),

  removeTypingUser: (userId) =>
    set((state) => {
      const newTypingUsers = new Set(state.typingUsers);
      newTypingUsers.delete(userId);
      return { typingUsers: newTypingUsers };
    }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearStore: () =>
    set({
      notes: [],
      currentNote: null,
      activeUsers: [],
      typingUsers: new Set(),
      isLoading: false,
      error: null,
    }),
}));
