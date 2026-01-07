'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Button,
  Input,
  Spinner,
  useDisclosure,
} from '@nextui-org/react';
import { ArrowLeft, Save, History, Users } from 'lucide-react';
import { useNoteStore } from '@/store/useNoteStore';
import { useUserStore } from '@/store/useUserStore';
import { api } from '@/services/api';
import {
  getSocket,
  joinNote,
  leaveNote,
  emitNoteUpdate,
  emitTyping,
  emitTitleUpdate,
  onNoteUpdate,
  onUserTyping,
  onUsersInRoom,
  onTitleUpdate,
  offNoteUpdate,
  offUserTyping,
  offUsersInRoom,
  offTitleUpdate,
} from '@/services/socket';
import RichTextEditor from '@/components/editor/RichTextEditor';
import CollaborationStatus from '@/components/notes/CollaborationStatus';
import VersionHistory from '@/components/notes/VersionHistory';

export default function NotePage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params?.id as string;

  const {
    currentNote,
    setCurrentNote,
    activeUsers,
    setActiveUsers,
    typingUsers,
    addTypingUser,
    removeTypingUser,
  } = useNoteStore();

  const { userId, userName } = useUserStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!noteId) return;

    loadNote();

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [noteId]);

  useEffect(() => {
    if (!noteId || !userId) return;

    const socket = getSocket();
    joinNote(noteId, userId, userName);

    onNoteUpdate(handleRemoteNoteUpdate);
    onUserTyping(handleUserTyping);
    onUsersInRoom(handleUsersInRoom);
    onTitleUpdate(handleTitleUpdate);

    return () => {
      leaveNote(noteId);
      offNoteUpdate();
      offUserTyping();
      offUsersInRoom();
      offTitleUpdate();
    };
  }, [noteId, userId, userName]);

  const loadNote = async () => {
    setIsLoading(true);
    try {
      const data = await api.getNote(noteId);
      setCurrentNote(data);
      setTitle(data.title);
      setContent(data.content);
    } catch (error) {
      console.error('Failed to load note:', error);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoteNoteUpdate = useCallback(
    (data: { content: any; userId: string; userName: string }) => {
      if (data.userId !== userId) {
        setContent(data.content);
      }
    },
    [userId]
  );

  const handleUserTyping = useCallback(
    (data: { userId: string; userName: string; isTyping: boolean }) => {
      if (data.userId !== userId) {
        if (data.isTyping) {
          addTypingUser(data.userId);
        } else {
          removeTypingUser(data.userId);
        }
      }
    },
    [userId, addTypingUser, removeTypingUser]
  );

  const handleUsersInRoom = useCallback((users: any[]) => {
    setActiveUsers(users);
  }, [setActiveUsers]);

  const handleTitleUpdate = useCallback(
    (data: { title: string; userId: string; userName: string }) => {
      if (data.userId !== userId) {
        setTitle(data.title);
      }
    },
    [userId]
  );

  const saveNote = async (newContent?: any, newTitle?: string) => {
    if (!noteId || !userId) return;

    setIsSaving(true);
    try {
      await api.updateNote(noteId, {
        content: newContent || content,
        title: newTitle || title,
        userId,
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (newContent: any) => {
    setContent(newContent);
    emitNoteUpdate(noteId, newContent, userId || '', userName);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveNote(newContent);
    }, 2000);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    emitTitleUpdate(noteId, newTitle, userId || '', userName);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveNote(content, newTitle);
    }, 1000);
  };

  const handleEditorFocus = () => {
    emitTyping(noteId, userId || '', userName, true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleEditorBlur = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(noteId, userId || '', userName, false);
    }, 1000);
  };

  const handleRestoreVersion = async (versionId: string) => {
    try {
      const restoredNote = await api.restoreVersion(noteId, versionId, userId || '');
      setContent(restoredNote.content);
      setTitle(restoredNote.title);
      emitNoteUpdate(noteId, restoredNote.content, userId || '', userName);
      emitTitleUpdate(noteId, restoredNote.title, userId || '', userName);
    } catch (error) {
      console.error('Failed to restore version:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button
            variant="light"
            startContent={<ArrowLeft size={20} />}
            onClick={() => router.push('/dashboard')}
          >
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-3">
            <CollaborationStatus
              activeUsers={activeUsers}
              typingUsers={typingUsers}
            />
            <Button
              color="primary"
              variant="flat"
              startContent={<History size={18} />}
              onClick={onOpen}
            >
              History
            </Button>
            <Button
              color="success"
              startContent={<Save size={18} />}
              onClick={() => saveNote()}
              isLoading={isSaving}
            >
              {isSaving ? 'Saving...' : lastSaved ? 'Saved' : 'Save'}
            </Button>
            <Button
              color="primary"
              startContent={<Save size={18} />}
              onClick={() => {
                saveNote();
                router.push('/dashboard');
              }}
              isLoading={isSaving}
            >
              Submit
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <Input
            placeholder="Note title..."
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            size="lg"
            variant="bordered"
            classNames={{
              input: 'text-3xl font-bold',
              inputWrapper: 'border-0 shadow-none',
            }}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {content !== null && (
            <RichTextEditor
              content={content}
              onChange={handleContentChange}
              onFocus={handleEditorFocus}
              onBlur={handleEditorBlur}
              placeholder="Start writing your note..."
            />
          )}
        </div>

        {lastSaved && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}
      </div>

      <VersionHistory
        noteId={noteId}
        isOpen={isOpen}
        onClose={onClose}
        onRestore={handleRestoreVersion}
      />
    </div>
  );
}
