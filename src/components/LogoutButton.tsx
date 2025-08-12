'use client';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useUser();

  return (
    <button
      onClick={() => {
        console.log('[LogoutButton] clicked. Removing token...');
        logout();
        router.refresh();
        router.push('/login');
      }}
      className="text-sm text-blue-600 underline hover:text-blue-800"
    >
      Logout
    </button>
  );
}
