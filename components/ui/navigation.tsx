'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from '@nextui-org/react';
import { LogIn, UserPlus, User, LogOut, Plus } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';

export default function Navigation() {
  const router = useRouter();
  const { userId, userName, userEmail, clearUser } = useUserStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!userId);
  }, [userId]);

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleSignup = () => {
    router.push('/auth/signup');
  };

  const handleCreateNote = async () => {
    if (!isLoggedIn) {
      router.push('/auth/login');
      return;
    }
    
    // If user is logged in, create a new note via the API
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Untitled Note',
          content: { type: 'doc', content: [] },
          userId: userId,
        }),
      });
      
      if (response.ok) {
        const newNote = await response.json();
        router.push(`/notes/${newNote._id}`);
      } else {
        // If API call fails, just go to dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error creating note:', error);
      // On error, go to dashboard
      router.push('/dashboard');
    }
  };

  const handleLogout = () => {
    clearUser();
    setIsLoggedIn(false);
    router.push('/');
  };

  const handleProfile = () => {
    router.push('/dashboard');
  };

  return (
    <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
      <div 
        className="text-2xl font-bold text-primary cursor-pointer"
        onClick={() => router.push('/')}
      >
        CollabNotes
      </div>
      
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <>
            <Button 
              color="primary" 
              startContent={<Plus size={18} />}
              onClick={handleCreateNote}
            >
              New Note
            </Button>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  radius="full"
                  size="sm"
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${userName}`}
                  className="cursor-pointer"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" onPress={handleProfile} startContent={<User size={16} />}>
                  My Profile
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onPress={handleLogout} startContent={<LogOut size={16} />}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        ) : (
          <>
            <Button 
              variant="bordered" 
              startContent={<LogIn size={18} />}
              onClick={handleLogin}
            >
              Login
            </Button>
            <Button 
              color="primary" 
              startContent={<UserPlus size={18} />}
              onClick={handleSignup}
            >
              Sign Up
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}