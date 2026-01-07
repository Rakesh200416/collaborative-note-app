'use client';

import { Card, CardBody, CardFooter, Button, Avatar, AvatarGroup, Tooltip } from '@nextui-org/react';
import { Trash2, Calendar, UserPlus } from 'lucide-react';
import { Note } from '@/store/useNoteStore';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { api } from '@/services/api';

interface NoteCardProps {
  note: Note;
  onDelete: (noteId: string) => void;
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  const getContentPreview = (content: any) => {
    if (!content || !content.content) return 'No content';

    const firstParagraph = content.content.find(
      (node: any) => node.type === 'paragraph' && node.content
    );

    if (!firstParagraph || !firstParagraph.content) return 'No content';

    const text = firstParagraph.content
      .filter((node: any) => node.type === 'text')
      .map((node: any) => node.text)
      .join('');

    return text.slice(0, 100) + (text.length > 100 ? '...' : '');
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardBody className="p-4">
        <Link href={`/notes/${note._id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
            {note.title}
          </h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {getContentPreview(note.content)}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar size={14} />
          <span>
            Updated {formatDistanceToNow(new Date(note.updatedAt))} ago
          </span>
        </div>
      </CardBody>
      <CardFooter className="border-t border-gray-200 dark:border-gray-700 p-3 flex justify-between items-center">
        <AvatarGroup max={3} size="sm">
          {note.collaborators?.map((user) => (
            <Avatar
              key={user._id}
              name={user.name}
              size="sm"
              showFallback
            />
          ))}
        </AvatarGroup>
        <div className="flex gap-2">
          <Tooltip content="Invite collaborators">
            <Button
              size="sm"
              variant="light"
              isIconOnly
              onClick={(e) => {
                e.preventDefault();
                // Prompt for email to invite
                const email = prompt('Enter email of collaborator to invite:');
                if (email) {
                  // Use the API service to invite the user
                  api.inviteCollaborator(note._id, email)
                  .then(() => {
                    // Generate a shareable link
                    const noteUrl = `${window.location.origin}/notes/${note._id}`;
                    // In a real app, this would send an email with the link
                    // For now, we'll just copy the link to clipboard and alert
                    navigator.clipboard.writeText(noteUrl);
                    alert(`Invitation sent to ${email} for note: ${note.title}.\nShareable link copied to clipboard: ${noteUrl}`);
                  })
                  .catch((error: any) => {
                    console.error('Error inviting collaborator:', error);
                    alert('Error inviting collaborator');
                  });
                }
              }}
              title="Invite collaborators"
            >
              <UserPlus size={16} />
            </Button>
          </Tooltip>
          <Button
            size="sm"
            color="danger"
            variant="light"
            isIconOnly
            onClick={(e) => {
              e.preventDefault();
              onDelete(note._id);
            }}
            title="Delete note"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
