"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
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
        const result = await signIn('credentials', {
            redirect: false,
            nidnNim,
            password,
        });

        if (result?.ok) {
            router.push('/');
        } else {
            setError('NIDN/NIM atau Password salah.');
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
            <h2 className="text-3xl font-bold text-gray-900">Sistem Manajemen PKM</h2>
            <p className="mt-2 text-gray-600">
                Belum punya akun?{' '}
                <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Daftar di sini
                </Link>
            </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
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
                {isLoading ? 'Memproses...' : 'Login'}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}