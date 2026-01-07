'use client';

import { Avatar, AvatarGroup, Chip } from '@nextui-org/react';
import { ActiveUser } from '@/store/useNoteStore';
import { Users } from 'lucide-react';

interface CollaborationStatusProps {
  activeUsers: ActiveUser[];
  typingUsers: Set<string>;
}

export default function CollaborationStatus({
  activeUsers,
  typingUsers,
}: CollaborationStatusProps) {
  const typingUserNames = activeUsers
    .filter((user) => typingUsers.has(user.userId))
    .map((user) => user.userName);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Users size={18} className="text-gray-500" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {activeUsers.length} {activeUsers.length === 1 ? 'user' : 'users'} online
        </span>
      </div>

      {activeUsers.length > 0 && (
        <AvatarGroup max={5} size="sm">
          {activeUsers.map((user) => (
            <Avatar
              key={user.socketId}
              name={user.userName}
              size="sm"
              showFallback
              isBordered={typingUsers.has(user.userId)}
              color={typingUsers.has(user.userId) ? 'success' : 'default'}
            />
          ))}
        </AvatarGroup>
      )}

      {typingUserNames.length > 0 && (
        <Chip size="sm" variant="flat" color="success">
          {typingUserNames.join(', ')}{' '}
          {typingUserNames.length === 1 ? 'is' : 'are'} typing...
        </Chip>
      )}
    </div>
  );
}
