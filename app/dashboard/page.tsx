'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Input,
  Spinner,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import { Plus, Search, FileText, Trash2 } from 'lucide-react';
import { useNoteStore } from '@/store/useNoteStore';
import { useUserStore } from '@/store/useUserStore';
import { api } from '@/services/api';
import NoteCard from '@/components/notes/NoteCard';
import Navigation from '@/components/ui/navigation';

export default function Dashboard() {
  const router = useRouter();
  const { notes, setNotes, deleteNote, isLoading, setIsLoading } = useNoteStore();
  const { userId, userName, setUser } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // If no user is logged in, redirect to login
    if (!userId) {
      router.push('/auth/login');
      return;
    }
    loadNotes();
  }, [userId, router]);

  const loadNotes = async () => {
    setIsLoading(true);
    try {
      const data = await api.getNotes(userId || undefined);
      setNotes(data);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadNotes();
  };

  const handleCreateNote = async () => {
    try {
      const newNote = await api.createNote({
        title: 'Untitled Note',
        content: { type: 'doc', content: [] },
        userId: userId || `user_${Date.now()}`,
      });
      router.push(`/notes/${newNote._id}`);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleDeleteNote = async () => {
    if (!deleteNoteId) return;

    try {
      await api.deleteNote(deleteNoteId);
      deleteNote(deleteNoteId);
      onClose();
      setDeleteNoteId(null);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const openDeleteModal = (noteId: string) => {
    setDeleteNoteId(noteId);
    onOpen();
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your notes and collaborate with your team
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="light"
              onClick={handleRefresh}
              className="shadow-md"
            >
              Refresh
            </Button>
            <Button
              color="primary"
              startContent={<Plus size={18} />}
              onClick={handleCreateNote}
              className="shadow-md"
            >
              New Note
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<Search size={18} />}
            size="md"
            classNames={{
              input: 'text-base',
              inputWrapper: 'shadow-sm h-12',
            }}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
              <FileText size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              {searchQuery
                ? 'Try a different search term'
                : 'Get started by creating your first note'}
            </p>
            <Button
              color="primary"
              startContent={<Plus size={18} />}
              onClick={handleCreateNote}
              size="lg"
            >
              Create Your First Note
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex items-center gap-2">
            <Trash2 size={20} />
            Delete Note
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this note? This action cannot be undone.</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleDeleteNote}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
