'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '@/lib/graphql/client';
import { gql } from 'graphql-tag';

const GET_PRINT_REQUESTS = gql`
  query {
    getPrintRequests {
      id
      fileUrl
      plasticType {
        name
      }
      color {
        name
        hex
      }
      createdAt
    }
  }
`;

const DELETE_REQUEST = gql`
  mutation DeletePrintRequest($id: ID!) {
    deletePrintRequest(id: $id)
  }
`;

export default function PrintHistoryPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    client
      .query(
        GET_PRINT_REQUESTS,
        {},
        { fetchOptions: { headers: { Authorization: `Bearer ${token}` } } }
      )
      .toPromise()
      .then((res) => {
        if (res.error) return router.push('/login');
        setRequests(res.data.getPrintRequests);
        setLoading(false);
      });
  }, [router]);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    await client
      .mutation(
        DELETE_REQUEST,
        { id },
        { fetchOptions: { headers: { Authorization: `Bearer ${token}` } } }
      )
      .toPromise();

    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  if (loading) return <p className="text-center text-blue-700 mt-8">Loading print history...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white border border-blue-700 p-6 rounded-xl">
      <h1 className="text-xl font-semibold text-blue-700 mb-4">Your Print Requests</h1>
      {requests.length === 0 ? (
        <p className="text-gray-500 text-center">No print requests yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-blue-700 bg-white rounded shadow ">
            <thead>
              <tr className="text-blue-700 font-semibold">
                <th className="border border-blue-700 px-4 py-2 text-left">File</th>
                <th className="border border-blue-700 px-4 py-2 text-left">Plastic Type</th>
                <th className="border border-blue-700 px-4 py-2 text-left">Color</th>
                <th className="border border-blue-700 px-4 py-2 text-left">Submitted At</th>
                <th className="border border-blue-700 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="border border-blue-700 px-4 py-2">
                    <a
                      href={r.fileUrl}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {r.fileUrl}
                    </a>
                  </td>
                  <td className="border border-blue-700 text-blue-700 px-4 py-2">{r.plasticType.name}</td>
                  <td className="border border-blue-700 px-4 py-2" style={{ color: r.color.hex }}>
                    {r.color.name}
                  </td>
                  <td className="border border-blue-700 px-4 py-2 text-blue-700">
                    {new Date(r.createdAt.replace(' ', 'T')).toLocaleString()}
                  </td>
                  <td className="border border-blue-700 px-4 py-2">
                    <button onClick={() => handleDelete(r.id)} className="text-red-500 underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
