'use client';
import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

const fetcher = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};

export function useUser() {
  const { mutate } = useSWRConfig();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      const t = localStorage.getItem('token');
      console.log('[useUser] token read from localStorage:', t);
      setToken(t);
    };
    read();
    window.addEventListener('storage', read);
    return () => window.removeEventListener('storage', read);
  }, []);

  const {
    data,
    error,
    isLoading,
    mutate: mutateUser,
  } = useSWR(
    token ? ['/api/user', token] : null,
    ([url, t]) => {
      console.log('[useUser] SWR fetch starting. url:', url, 'token present:', !!t);
      return fetcher(url, t as string);
    },
    { revalidateOnFocus: false }
  );

  console.log('[useUser] SWR result:', { data, error, isLoading });

  
  const logout = () => {
    localStorage.removeItem('token');
    
    mutate(['/api/user', token], null, false);
    mutate('/api/user', null, false);
  };

  return {
    user: data ?? null,
    isLoading: Boolean(token) && isLoading,
    isError: error,
    logout,
    mutateUser,
  };
}
