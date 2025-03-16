
import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isSignedIn } = useAuth();

  // Redirect to sign-in if user is not authenticated
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="container mx-auto max-w-screen-2xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
