// src/components/dashboard/UserManager.tsx
"use client";

import { User } from "@/types";
import { UserCog, Search } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface UserManagerProps {
    users: User[];
    refreshData: () => Promise<void>;
}

type RoleType = 'dosen' | 'mahasiswa' | 'reviewer_penelitian' | 'reviewer_pengabdian';

const UserManager = ({ users, refreshData }: UserManagerProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleRoleChange = async (user: User, role: RoleType, isChecked: boolean) => {
        let newRoles = [...user.peran];

        if (isChecked) {
            if (!newRoles.includes(role)) {
                newRoles.push(role);
            }
        } else {
            newRoles = newRoles.filter(r => r !== role);
        }

        newRoles = newRoles.filter(r => r !== 'reviewer');

        const toastId = toast.loading('Memperbarui peran...');
        try {
            const response = await fetch(`/api/users/${user.id}/roles`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ peran: newRoles }),
            });

            if (response.ok) {
                toast.success('Peran berhasil diperbarui!', { id: toastId });
                await refreshData();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Gagal memperbarui peran.');
            }
        } catch (error: any) {
            toast.error(error.message, { id: toastId });
        }
    };

    const filteredUsers = users.filter(user => {
        if (user.peran.includes('admin_p3m')) {
            return false;
        }
        if (searchTerm === '') {
            return true;
        }
        return (
            user.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.nidnNim.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <UserCog className="w-6 h-6 mr-3 text-blue-600"/>Manajemen Pengguna & Peran
            </h2>
            <div className="mb-4 relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari pengguna berdasarkan nama atau NIDN/NIM..."
                    className="input-field pl-10 text-gray-900"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIDN/NIM</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peran</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.namaLengkap}</td>
                                    <td className="px-6 py-4 text-gray-900">{user.nidnNim}</td>
                                    <td className="px-6 py-4 text-gray-900">
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                            <label className="flex items-center">
                                                <input type="checkbox" className="h-4 w-4 rounded" checked={user.peran.includes('dosen')} disabled={user.nidnNim.length > 8} onChange={(e) => handleRoleChange(user, 'dosen', e.target.checked)} />
                                                <span className="ml-2 text-sm">Dosen</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="h-4 w-4 rounded" checked={user.peran.includes('mahasiswa')} disabled={user.nidnNim.length <= 8} onChange={(e) => handleRoleChange(user, 'mahasiswa', e.target.checked)} />
                                                <span className="ml-2 text-sm">Mahasiswa</span>
                                            </label>
                                            {/* PERUBAHAN DI SINI */}
                                            <label className="flex items-center">
                                                <input type="checkbox" className="h-4 w-4 rounded" checked={user.peran.includes('reviewer_penelitian')} onChange={(e) => handleRoleChange(user, 'reviewer_penelitian', e.target.checked)} disabled={!user.peran.includes('dosen')} />
                                                <span className="ml-2 text-sm">Reviewer Pengabdian</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="h-4 w-4 rounded" checked={user.peran.includes('reviewer_pengabdian')} onChange={(e) => handleRoleChange(user, 'reviewer_pengabdian', e.target.checked)} disabled={!user.peran.includes('dosen')} />
                                                <span className="ml-2 text-sm">Reviewer Penelitian</span>
                                            </label>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center py-10 text-gray-500">
                                    Pengguna tidak ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManager;