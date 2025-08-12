'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gql } from 'graphql-tag';
import { client } from '@/lib/graphql/client';

const SUBMIT_MUTATION = gql`
  mutation SubmitPrintRequest($fileUrl: String!, $plasticTypeId: String!, $colorId: String!) {
    submitPrintRequest(fileUrl: $fileUrl, plasticTypeId: $plasticTypeId, colorId: $colorId) {
      id
    }
  }
`;

const GET_TYPES = gql`
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
`;

export default function SubmitPage() {
  const router = useRouter();
  const [fileUrl, setFileUrl] = useState('');
  const [plasticTypes, setPlasticTypes] = useState<any[]>([]);
  const [selectedPlastic, setSelectedPlastic] = useState('');
  const [colors, setColors] = useState<any[]>([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    client
      .query(GET_TYPES, {}, { fetchOptions: { headers: { Authorization: `Bearer ${token}` } } })
      .toPromise()
      .then((res) => setPlasticTypes(res.data.getPlasticTypes));
  }, [router]);

  useEffect(() => {
    const selected = plasticTypes.find((p) => p.id === selectedPlastic);
    if (selected) {
      const inStockColors = selected.colors.filter((c: any) => c.inStock).map((c: any) => c.color);
      setColors(inStockColors);
      setSelectedColor('');
    }
  }, [selectedPlastic, plasticTypes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');

    const result = await client
      .mutation(
        SUBMIT_MUTATION,
        { fileUrl, plasticTypeId: selectedPlastic, colorId: selectedColor },
        { fetchOptions: { headers: { Authorization: `Bearer ${token}` } } }
      )
      .toPromise();

    if (result.error) {
      setMessage('Error submitting request.');
    } else {
      setFileUrl('');
      setSelectedPlastic('');
      setSelectedColor('');
      router.push('/history');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white border border-blue-700 p-6 rounded-xl">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Submit Print Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          data-testid="file-url"
          type="text"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          placeholder="File URL"
          className="w-full border p-2 rounded text-blue-700"
          required
        />
        <select
          data-testid="plastic-select"
          value={selectedPlastic}
          onChange={(e) => setSelectedPlastic(e.target.value)}
          className="w-full border p-2 rounded text-blue-700"
          required
        >
          <option value="">Select Plastic</option>
          {plasticTypes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          data-testid="color-select"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="w-full border p-2 rounded text-blue-700"
          required
          disabled={!selectedPlastic}
        >
          <option value="">Select Color</option>
          {colors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          data-testid="submit-btn"
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
        {message && <p className="text-green-600">{message}</p>}
      </form>
    </div>
  );
}
