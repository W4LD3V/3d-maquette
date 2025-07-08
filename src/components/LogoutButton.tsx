'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        localStorage.removeItem('token');
        router.push('/login');
      }}
      className="text-sm text-blue-600 underline hover:text-blue-800"
    >
      Logout
    </button>
  );
}
