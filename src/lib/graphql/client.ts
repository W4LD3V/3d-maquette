import { createClient, cacheExchange, fetchExchange } from 'urql';

export const client = createClient({
  url: '/api/graphql',
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return {
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  },
});
