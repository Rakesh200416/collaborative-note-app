'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card, CardBody, CardHeader, CardFooter, Divider } from '@nextui-org/react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      // Make API call to register
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Set user in store with real user data from API
        setUser(data.user._id, data.user.name, data.user.email);
        router.push('/');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
      console.error('Registration error:', err);
    }
  };

  const handleDemoSignup = async () => {
    const demoEmail = `demo_${Date.now()}@example.com`;
    const demoName = `Demo User ${Math.floor(Math.random() * 1000)}`;
    const demoPassword = 'Password123!';
    
    try {
      // Make API call to register demo user
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: demoName, email: demoEmail, password: demoPassword }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Set user in store with real user data from API
        setUser(data.user._id, data.user.name, data.user.email);
        router.push('/');
      }
    } catch (err) {
      console.error('Demo signup error:', err);
      // Fallback to old method if API fails
      const userId = `user_${Date.now()}`;
      setUser(userId, demoName, demoEmail);
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="flex flex-col gap-1 items-center pt-8">
          <h1 className="text-3xl font-bold text-primary">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400">Join us today</p>
        </CardHeader>
        <CardBody className="py-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                startContent={<User className="text-gray-400" size={18} />}
                variant="bordered"
                isRequired
              />
              
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startContent={<Mail className="text-gray-400" size={18} />}
                variant="bordered"
                isRequired
              />
              
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                startContent={<Lock className="text-gray-400" size={18} />}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                variant="bordered"
                isRequired
              />
              
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                startContent={<Lock className="text-gray-400" size={18} />}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                variant="bordered"
                isRequired
              />
              
              {error && (
                <div className="text-danger text-sm">{error}</div>
              )}
              
              <Button 
                type="submit" 
                color="primary" 
                size="lg" 
                className="mt-4"
              >
                Sign Up
              </Button>
            </div>
          </form>
          
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  OR
                </span>
              </div>
            </div>
          </div>
          
          <Button 
            color="default" 
            variant="bordered" 
            size="lg"
            onClick={handleDemoSignup}
            className="w-full bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Continue as Guest
          </Button>
        </CardBody>
        <CardFooter className="flex justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}