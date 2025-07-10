import useSWR from 'swr';

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  });

export function useUser() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher);
  return {
    user: data,
    isLoading,
    isError: error,
  };
}
