'use client';

import { useUser } from '@/hooks/useUser';
import LogoutButton from './LogoutButton';
import Link from 'next/link';

export default function Header() {
  const { user, isLoading } = useUser();

  return (
    <header className="flex justify-between items-center container mx-auto px-4 py-8 ">
      <div className="text-blue-700 font-bold text-xl">
        <Link href="/dashboard">3D Maquette</Link>
      </div>
      <nav className="flex items-center gap-4">
        <Link href="/submit" className="text-blue-700 hover:underline">
          Submit
        </Link>
        <Link href="/history" className="text-blue-700 hover:underline">
          History
        </Link>
        {isLoading ? (
          <p className="text-blue-500">Loading user...</p>
        ) : user ? (
          <span className="text-blue-700">{user.email}</span>
        ) : null}
        <LogoutButton />
      </nav>
    </header>
  );
}
