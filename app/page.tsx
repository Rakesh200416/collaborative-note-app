'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardFooter, Divider } from '@nextui-org/react';
import { Plus, LogIn, UserPlus } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import Navigation from '@/components/ui/navigation';

export default function Home() {
  const router = useRouter();
  const { userId } = useUserStore();
  
  useEffect(() => {
    // Don't redirect if user is on the home page and authenticated
    // Only redirect to dashboard if needed
  }, [userId, router]);
  
  const handleAddNote = () => {
    router.push('/auth/login');
  };
  
  const handleLogin = () => {
    router.push('/auth/login');
  };
  
  const handleSignup = () => {
    router.push('/auth/signup');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
            Real-time Collaboration
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Collaborative Note-Taking Made Simple
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            Create, share, and collaborate on notes in real-time with powerful formatting tools and version history.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button 
              color="primary" 
              size="lg" 
              startContent={<Plus size={20} />}
              onClick={handleAddNote}
              className="text-lg px-8 py-6"
            >
              Create Your First Note
            </Button>
            <Button 
              variant="bordered" 
              size="lg" 
              onClick={() => router.push('/auth/signup')}
              className="text-lg px-8 py-6"
            >
              Start Free Trial
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-300">Active Users</div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-gray-600 dark:text-gray-300">Notes Created</div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-gray-600 dark:text-gray-300">Uptime</div>
            </div>
          </div>
        </div>
        
        {/* Example Notes Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How Your Notes Will Look
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Example Note 1 */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500">
              <CardBody className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Roadmap</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">2 days ago</span>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    Strategic planning for the upcoming quarter...
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <p className="ml-2 text-gray-600 dark:text-gray-300"><strong>Q1 Goals:</strong> Product launch & market expansion</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <p className="ml-2 text-gray-600 dark:text-gray-300"><em>Team size:</em> Scale to 15 members</p>
                    </div>
                  </div>
                </div>
              </CardBody>
              <Divider />
              <CardFooter className="flex justify-between text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-2">
                    JD
                  </div>
                  <span>John Doe</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-1">👥</div>
                  <span>2 collaborators</span>
                </div>
              </CardFooter>
            </Card>
            
            {/* Example Note 2 */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-purple-500">
              <CardBody className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Meeting Minutes</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">Updated yesterday</span>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    Weekly team sync meeting notes...
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                    <li>Discussed Q3 goals and KPIs</li>
                    <li>Team restructuring and new hires</li>
                    <li>Upcoming project deadlines</li>
                  </ul>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Action Items:</p>
                    <p className="text-gray-600 dark:text-gray-300">Follow up with design team by Friday</p>
                  </div>
                </div>
              </CardBody>
              <Divider />
              <CardFooter className="flex justify-between text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs mr-2">
                    JS
                  </div>
                  <span>Jane Smith</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-1">👥</div>
                  <span>5 collaborators</span>
                </div>
              </CardFooter>
            </Card>
            
            {/* Example Note 3 */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-green-500">
              <CardBody className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Technical Specs</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">3 days ago</span>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono mb-3">
                    const result = processData(data);
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    Key findings from the technical research:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <p className="ml-2 text-gray-600 dark:text-gray-300">Users prefer simplified interfaces</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                      <p className="ml-2 text-gray-600 dark:text-gray-300">Real-time collaboration is essential</p>
                    </div>
                  </div>
                </div>
              </CardBody>
              <Divider />
              <CardFooter className="flex justify-between text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs mr-2">
                    AJ
                  </div>
                  <span>Alex Johnson</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-1">👥</div>
                  <span>3 collaborators</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mt-24 py-16 bg-gray-50 dark:bg-gray-800/30 rounded-3xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose CollabNotes?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Designed for teams and individuals who value seamless collaboration and powerful features
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <div className="text-2xl">🔄</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Real-time Collaboration</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Work together with your team in real-time, with changes appearing instantly for all collaborators.
                </p>
              </div>
              <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <div className="text-2xl">⏱️</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Version History</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Track all changes and restore previous versions of your notes with our comprehensive version history.
                </p>
              </div>
              <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <div className="text-2xl">📝</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Rich Formatting</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Format your notes with headings, lists, code blocks, and more using our powerful editor.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div className="mt-24 py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join teams and individuals who transformed their workflow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-2xl">★★★★★</div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "This app has revolutionized how our team takes notes. The real-time collaboration feature is a game-changer!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm mr-3">
                  JD
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">John Doe</div>
                  <div className="text-sm text-gray-500">Product Manager</div>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-2xl">★★★★★</div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "The version history feature saved us countless hours. We can always track what changed and when."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm mr-3">
                  JS
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Jane Smith</div>
                  <div className="text-sm text-gray-500">Team Lead</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
