// src/components/modals/ProfileModal.tsx
"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs"; // Import Tabs
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

interface ProfileFormData {
    namaLengkap: string;
    nidnNim: string;
    jurusan: string;
    program_studi: string;
    nomor_rekening: string;
    jabatan_fungsional: string;
    sinta_score: number | string;
    sinta_id: string;
}

export const ProfileModal = () => {
    const [formData, setFormData] = useState<ProfileFormData | null>(null);
    // State untuk form profil
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    
    // State baru untuk form ganti password
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('/api/profile');
                if (!response.ok) throw new Error('Gagal memuat profil');
                const data = await response.json();
                setFormData({
                    namaLengkap: data.namaLengkap || '',
                    nidnNim: data.nidnNim || '',
                    jurusan: data.jurusan || '',
                    program_studi: data.program_studi || '',
                    nomor_rekening: data.nomor_rekening || '',
                    jabatan_fungsional: data.jabatan_fungsional || '',
                    sinta_score: data.sinta_score || '',
                    sinta_id: data.sinta_id || '',
                });
            } catch (error) {
                toast.error('Gagal memuat data profil.');
            }
        };
        fetchProfile();
    }, []);

    // Handler untuk perubahan form profil
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (formData) {
            setFormData((prev) => ({ ...prev!, [name]: value }));
        }
    };
    
    // Handler baru untuk perubahan form password
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    // Handler untuk submit form profil
    const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error('Gagal menyimpan perubahan');
            toast.success('Profil berhasil diperbarui!');
        } catch (error) {
            toast.error('Gagal menyimpan perubahan.');
        } finally {
            setIsSavingProfile(false);
        }
    };

    // Handler baru untuk submit form password
    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Konfirmasi password baru tidak cocok.");
            return;
        }
        setIsSavingPassword(true);
        try {
            const response = await fetch('/api/profile/change-password', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Gagal mengubah password');
            
            toast.success('Password berhasil diperbarui!');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' }); // Reset form
        } catch (error: any) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsSavingPassword(false);
        }
    };

    if (!formData) {
        return (
            <Dialog.Portal>
                <Dialog.Overlay className="bg-black/50 fixed inset-0 z-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg z-50">
                Memuat profil...
                </Dialog.Content>
            </Dialog.Portal>
        );
    }

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlay-show fixed inset-0 z-50" />
            <Dialog.Content className="data-[state=open]:animate-content-show fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50">
                
                {/* Implementasi Tabs */}
                <Tabs.Root defaultValue="profil">
                    <Tabs.List className="flex border-b border-gray-200 mb-5">
                        <Tabs.Trigger value="profil" className="px-4 py-2 -mb-px text-sm font-medium text-gray-500 hover:text-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 focus:outline-none">
                            Profil
                        </Tabs.Trigger>
                        <Tabs.Trigger value="keamanan" className="px-4 py-2 -mb-px text-sm font-medium text-gray-500 hover:text-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 focus:outline-none">
                            Keamanan
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="profil" className="focus:outline-none flex flex-col h-[70vh]">
                    <div>
                        <Dialog.Title className="text-xl font-bold text-gray-900">Edit Profil</Dialog.Title>
                        <Dialog.Description className="mt-2 mb-5 text-sm text-gray-500">
                        Buat perubahan pada profil Anda. Klik simpan jika sudah selesai.
                        </Dialog.Description>
                    </div>
                    <form id="profile-form" onSubmit={handleProfileSubmit} className="flex-grow space-y-4 overflow-y-auto pr-3 py-2">
                            <div>
                                <label htmlFor="namaLengkap" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                <input type="text" id="namaLengkap" name="namaLengkap" value={formData.namaLengkap} onChange={handleProfileChange} placeholder="Masukkan nama lengkap" className="mt-1 block w-full border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-gray-900"/>
                            </div>
                            
                            {/* Field NIDN / NIM */}
                            <div>
                                <label htmlFor="nidnNim" className="block text-sm font-medium text-gray-700">NIDN / NIM</label>
                                <input type="text" id="nidnNim" name="nidnNim" value={formData.nidnNim} disabled className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 placeholder-gray-500 text-gray-900"/>
                            </div>
                            
                            {/* Jurusan */}
                            <div>
                                <label htmlFor="jurusan" className="block text-sm font-medium text-gray-700">Jurusan</label>
                                <input type="text" id="jurusan" name="jurusan" value={formData.jurusan} onChange={handleProfileChange} placeholder="e.g., Teknik Elektro" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-gray-900"/>
                            </div>
                            
                            {/* Program Studi */}
                            <div>
                                <label htmlFor="program_studi" className="block text-sm font-medium text-gray-700">Program Studi</label>
                                <input type="text" id="program_studi" name="program_studi" value={formData.program_studi} onChange={handleProfileChange} placeholder="e.g., D4 Teknik Informatika" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-gray-900"/>
                            </div>
                            
                            {/* Nomor Rekening */}
                            <div>
                                <label htmlFor="nomor_rekening" className="block text-sm font-medium text-gray-700">Nomor Rekening</label>
                                <input type="text" id="nomor_rekening" name="nomor_rekening" value={formData.nomor_rekening} onChange={handleProfileChange} placeholder="Masukkan nomor rekening" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-gray-900"/>
                            </div>
                            
                            {/* Jabatan Fungsional */}
                            <div>
                                <label htmlFor="jabatan_fungsional" className="block text-sm font-medium text-gray-700">Jabatan Fungsional</label>
                                <input type="text" id="jabatan_fungsional" name="jabatan_fungsional" value={formData.jabatan_fungsional} onChange={handleProfileChange} placeholder="e.g., Lektor" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-gray-900"/>
                            </div>
                            
                            {/* Sinta Score */}
                            <div>
                                <label htmlFor="sinta_score" className="block text-sm font-medium text-gray-700">Sinta Score</label>
                                <input type="number" id="sinta_score" name="sinta_score" value={formData.sinta_score} onChange={handleProfileChange} placeholder="0" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-gray-900"/>
                            </div>
                            
                            {/* Sinta ID */}
                            <div>
                                <label htmlFor="sinta_id" className="block text-sm font-medium text-gray-700">Sinta ID</label>
                                <input type="text" id="sinta_id" name="sinta_id" value={formData.sinta_id} onChange={handleProfileChange} placeholder="e.g., 6011234" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-gray-900"/>
                            </div>
                            </form>
                    <div className="flex-shrink-0 flex justify-end pt-4 mt-4 border-t">
                        <Dialog.Close asChild>
                        <button type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 mr-3">
                            Batal
                        </button>
                        </Dialog.Close>
                        <button 
                        type="submit" 
                        form="profile-form" 
                        disabled={isSavingProfile} 
                        className="inline-flex justify-center py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                        {isSavingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                    </Tabs.Content>

                    <Tabs.Content value="keamanan" className="focus:outline-none">
                        <Dialog.Title className="text-xl font-bold text-gray-900">Ganti Password</Dialog.Title>
                        <Dialog.Description className="mt-2 mb-5 text-sm text-gray-500">Untuk keamanan, masukkan password lama Anda sebelum membuat password baru.</Dialog.Description>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password Lama</label>
                                <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} required className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 placeholder-gray-500"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password Baru</label>
                                <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 placeholder-gray-500"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
                                <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 placeholder-gray-500"/>
                            </div>
                            <div className="mt-6 flex justify-end pt-4 border-t">
                                <button type="submit" disabled={isSavingPassword} className="inline-flex justify-center py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                                    {isSavingPassword ? 'Menyimpan...' : 'Simpan Password'}
                                </button>
                            </div>
                        </form>
                    </Tabs.Content>
                </Tabs.Root>
                
                <Dialog.Close asChild>
                    <button className="absolute top-4 right-4 rounded-full text-gray-500 hover:bg-gray-100 p-1 focus:outline-none" aria-label="Close"><X size={18} /></button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    );
};