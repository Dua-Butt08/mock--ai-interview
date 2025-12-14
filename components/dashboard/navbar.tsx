'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/context-supabase';
import { LogOut, Home, PlusCircle, User } from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const { user, logout } = useApp();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-2xl font-bold gradient-text">AI Mock Interview</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2">
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/interview/create">
              <Button variant="ghost" className="gap-2">
                <PlusCircle className="w-4 h-4" />
                New Interview
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/user-avatar.png"
              alt="User"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-muted-foreground">{user?.name}</span>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
