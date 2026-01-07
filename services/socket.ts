import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinNote = (noteId: string, userId: string, userName: string) => {
  const currentSocket = getSocket();
  currentSocket.emit('join-note', { noteId, userId, userName });
};

export const leaveNote = (noteId: string) => {
  const currentSocket = getSocket();
  currentSocket.emit('leave-note', { noteId });
};

export const emitNoteUpdate = (
  noteId: string,
  content: any,
  userId: string,
  userName: string
) => {
  const currentSocket = getSocket();
  currentSocket.emit('note-update', { noteId, content, userId, userName });
};

export const emitTyping = (
  noteId: string,
  userId: string,
  userName: string,
  isTyping: boolean
) => {
  const currentSocket = getSocket();
  currentSocket.emit('typing', { noteId, userId, userName, isTyping });
};

export const emitTitleUpdate = (
  noteId: string,
  title: string,
  userId: string,
  userName: string
) => {
  const currentSocket = getSocket();
  currentSocket.emit('title-update', { noteId, title, userId, userName });
};

export const onNoteUpdate = (callback: (data: any) => void) => {
  const currentSocket = getSocket();
  currentSocket.on('note-update', callback);
};

export const onUserTyping = (callback: (data: any) => void) => {
  const currentSocket = getSocket();
  currentSocket.on('user-typing', callback);
};

export const onUsersInRoom = (callback: (users: any[]) => void) => {
  const currentSocket = getSocket();
  currentSocket.on('users-in-room', callback);
};

export const onTitleUpdate = (callback: (data: any) => void) => {
  const currentSocket = getSocket();
  currentSocket.on('title-update', callback);
};

export const offNoteUpdate = () => {
  const currentSocket = getSocket();
  currentSocket.off('note-update');
};

export const offUserTyping = () => {
  const currentSocket = getSocket();
  currentSocket.off('user-typing');
};

export const offUsersInRoom = () => {
  const currentSocket = getSocket();
  currentSocket.off('users-in-room');
};

export const offTitleUpdate = () => {
  const currentSocket = getSocket();
  currentSocket.off('title-update');
};
