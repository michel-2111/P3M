// src/app/register/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nidnNim, setNidnNim] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ namaLengkap, nidnNim, password }),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const data = await response.json();
        setError(data.message || 'Gagal melakukan registrasi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan pada jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <img src="https://i.imgur.com/kYImLzJ.png" alt="Logo Polimdo" className="w-32 mx-auto mb-4" onError={(e) => (e.currentTarget.src = 'https://placehold.co/150x40/003366/FFFFFF?text=P3M+POLIMDO')} />
          <h2 className="text-3xl font-bold text-gray-900">Buat Akun Baru</h2>
          <p className="mt-2 text-gray-600">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Masuk di sini
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="nama-lengkap" className="sr-only">Nama Lengkap</label>
              <input id="nama-lengkap" name="nama-lengkap" type="text" required className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Nama Lengkap" value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} />
            </div>
            <div>
              <label htmlFor="nidn-nim" className="sr-only">NIDN / NIM</label>
              <input id="nidn-nim" name="nidn-nim" type="text" required className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="NIDN / NIM" value={nidnNim} onChange={(e) => setNidnNim(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" required className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div>
            <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400">
              {isLoading ? 'Mendaftarkan...' : 'Daftar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
