'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { client } from '@/lib/graphql/client';
import { gql } from 'graphql-tag';
import LogoutButton from '@/components/LogoutButton';

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

const SUBMIT_REQUEST = gql`
  mutation SubmitPrintRequest($fileUrl: String!, $plasticTypeId: String!, $colorId: String!) {
    submitPrintRequest(fileUrl: $fileUrl, plasticTypeId: $plasticTypeId, colorId: $colorId) {
      id
    }
  }
`;

export default function DashboardPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState('');
  const [plasticTypes, setPlasticTypes] = useState<any[]>([]);
  const [selectedPlastic, setSelectedPlastic] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [colors, setColors] = useState<any[]>([]);
  const [submitMessage, setSubmitMessage] = useState('');
  const { user, isLoading: loadingUser } = useUser();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    Promise.all([
      client
        .query(
          GET_PRINT_REQUESTS,
          {},
          { fetchOptions: { headers: { Authorization: `Bearer ${token}` } } }
        )
        .toPromise(),
      client
        .query(
          gql`
            query {
              getPlasticTypes {
                id
                name
                colors {
                  id
                  inStock
                  color {
                    id
                    name
                    hex
                  }
                }
              }
            }
          `,
          {},
          { fetchOptions: { headers: { Authorization: `Bearer ${token}` } } }
        )
        .toPromise(),
    ]).then(([reqRes, typesRes]) => {
      if (reqRes.error || typesRes.error) {
        router.push('/login');
      } else {
        setRequests(reqRes.data.getPrintRequests);
        setPlasticTypes(typesRes.data.getPlasticTypes);
        setLoading(false);
      }
    });
  }, [router]);

  useEffect(() => {
    const selected = plasticTypes.find((p) => p.id === selectedPlastic);
    if (selected) {
      const filtered = selected.colors.filter((c: any) => c.inStock).map((c: any) => c.color);
      setColors(filtered);
      setSelectedColor('');
    }
  }, [selectedPlastic, plasticTypes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage('');
    const token = localStorage.getItem('token');

    const result = await client
      .mutation(
        SUBMIT_REQUEST,
        {
          fileUrl,
          plasticTypeId: selectedPlastic,
          colorId: selectedColor,
        },
        {
          context: {
            fetchOptions: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          },
        }
      )
      .toPromise();

    if (result.error) {
      console.error('GraphQL error:', result.error);
      setSubmitMessage('Error submitting print request.');
    } else {
      setSubmitMessage('Print request submitted successfully!');
      setFileUrl('');
      setSelectedPlastic('');
      setSelectedColor('');

      const updated = await client
        .query(
          GET_PRINT_REQUESTS,
          {},
          {
            fetchOptions: { headers: { Authorization: `Bearer ${token}` } },
          }
        )
        .toPromise();
      if (!updated.error) {
        setRequests(updated.data.getPrintRequests);
      }
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-blue-500">Loading your print requests...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      {loadingUser ? (
        <p className="text-blue-500">Loading user...</p>
      ) : user ? (
        <p className="mb-4 text-blue-700 font-medium">Welcome, {user.email} 👋</p>
      ) : null}

      <LogoutButton />
      <div className="bg-white border border-blue-100 p-6 rounded-xl shadow mb-10">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Submit New Print Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-700">File URL</label>
            <input
              type="text"
              className="mt-1 p-2 border rounded w-full text-blue-700"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700">Plastic Type</label>
            <select
              className="mt-1 p-2 border rounded w-full text-blue-700"
              value={selectedPlastic}
              onChange={(e) => setSelectedPlastic(e.target.value)}
              required
            >
              <option value="">Select a plastic</option>
              {plasticTypes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700">Color</label>
            <select
              className="mt-1 p-2 border rounded w-full text-blue-700"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              required
              disabled={!selectedPlastic}
            >
              <option value="">Select a color</option>
              {colors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Request
          </button>
          {submitMessage && <p className="text-sm text-green-600 mt-2">{submitMessage}</p>}
        </form>
      </div>

      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Your Print Requests</h1>
      {requests.length === 0 ? (
        <p className="text-center text-gray-500">No print requests yet.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((r) => (
            <li key={r.id} className="bg-white p-4 rounded-xl shadow-md border border-blue-100">
              <p>
                <strong>File:</strong>{' '}
                <a
                  href={r.fileUrl}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {r.fileUrl}
                </a>
              </p>
              <p>
                <strong>Plastic:</strong>{' '}
                <span className="text-blue-700 font-semibold">{r.plasticType.name}</span>
              </p>
              <p>
                <strong>Color:</strong> <span style={{ color: r.color.hex }}>{r.color.name}</span>
              </p>
              <p className="text-sm text-gray-500">
                Submitted: {new Date(r.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
