// src/components/modals/CompleteProposalModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Proposal } from '@/types';
import Modal from '@/components/common/Modal';
import { BookOpenCheck, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface CompleteProposalModalProps {
    proposal: Proposal;
    settings: any;
    onClose: () => void;
    onSubmit: (proposalId: number, data: any) => void;
}

const CompleteProposalModal = ({ proposal, settings, onClose, onSubmit }: CompleteProposalModalProps) => {
    const [details, setDetails] = useState(proposal.detailProposal || {});
    const [files, setFiles] = useState<Record<string, File>>({});
    const [luaranTambahan, setLuaranTambahan] = useState<string[]>(proposal.detailProposal?.luaranTambahan || []);
    const [inputLuaran, setInputLuaran] = useState('');

    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setDetails(proposal.detailProposal || {});
        setLuaranTambahan(proposal.detailProposal?.luaranTambahan || []);
    }, [proposal]);

    const program = proposal.program;
    const isPenelitian = program.kategori === 'Penelitian';

    const fieldsToRender = (isPenelitian 
        ? settings.proposal_details?.penelitian 
        : settings.proposal_details?.pengabdian) ?? [];

    const documentsToDisplay = (isPenelitian 
        ? settings.document_settings?.penelitian 
        : settings.document_settings?.pengabdian) ?? [];
    
    const requiredDocs = documentsToDisplay.filter((d: any) => d.isRequired);

    const handleDetailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDetails((prev: any) => ({ ...prev, [name]: value }));
    };
    
    const handleFileChange = (docId: string, file: File | null) => {
        if (file) { setFiles(prev => ({ ...prev, [docId]: file })); }
    };
    
    const handleAddLuaran = () => {
        if (inputLuaran.trim() !== '') {
            setLuaranTambahan([...luaranTambahan, inputLuaran.trim()]);
            setInputLuaran('');
        }
    };

    const handleRemoveLuaran = (indexToRemove: number) => {
        setLuaranTambahan(luaranTambahan.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        const toastId = toast.loading('Mempersiapkan unggahan...');

        try {

            const uploadedFileUrls: Record<string, string> = { ...(proposal.dokumenDiunggah as any) };

            const filesToUpload = Object.entries(files);
            for (let i = 0; i < filesToUpload.length; i++) {
                const [docId, file] = filesToUpload[i];
                toast.loading(`Mengunggah file ${i + 1}/${filesToUpload.length}: ${file.name}`, { id: toastId });

                const signedUrlResponse = await fetch('/api/uploads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileName: file.name, proposalId: proposal.id }),
                });
                if (!signedUrlResponse.ok) throw new Error('Gagal mendapatkan izin unggah dari server.');
                const { signedUrl, publicUrl } = await signedUrlResponse.json();

                const uploadResponse = await fetch(signedUrl, {
                    method: 'PUT',
                    body: file,
                    headers: { 'Content-Type': file.type },
                });
                if (!uploadResponse.ok) throw new Error(`Gagal mengunggah file ${file.name}.`);

                uploadedFileUrls[docId] = publicUrl;
            }

            const allRequiredDocsUploaded = requiredDocs.every((doc: any) => uploadedFileUrls[doc.id]);
            if (!allRequiredDocsUploaded) {
                throw new Error("Harap unggah semua dokumen yang wajib.");
            }

            toast.loading('Menyimpan data proposal...', { id: toastId });
            
            const submissionData = {
                detailProposal: { ...details, luaranTambahan: luaranTambahan },
                dokumenDiunggah: uploadedFileUrls,
            };

            await onSubmit(proposal.id, submissionData);
            
            toast.success('Proposal berhasil dilengkapi!', { id: toastId });

        } catch (error: any) {
            toast.error(error.message || 'Terjadi kesalahan.', { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Modal onClose={onClose} size="4xl">
            <form onSubmit={handleSubmit} className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Lengkapi Detail Proposal</h2>
                <p className="text-gray-600 mb-6">Judul: <span className="font-semibold">{proposal.judul}</span></p>
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                    
                    {fieldsToRender.map((field: any) => (
                        <div key={field.id}>
                            <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
                                {field.label} {field.isRequired && <span className="text-red-500">*</span>}
                            </label>
                            <textarea 
                                name={field.key} 
                                value={details[field.key] || ''} 
                                onChange={handleDetailChange} 
                                className="mt-1 input-field text-gray-900" 
                                rows={6} 
                                required={field.isRequired} 
                            />
                        </div>
                    ))}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Luaran Tambahan (Opsional)</label>
                        <div className="flex items-center mt-1 space-x-2">
                            <input type="text" value={inputLuaran} onChange={(e) => setInputLuaran(e.target.value)} className="input-field text-gray-900" placeholder="Contoh: Publikasi Jurnal Internasional" />
                            <button type="button" onClick={handleAddLuaran} className="btn-primary p-2"><Plus size={20}/></button>
                        </div>
                        <ul className="mt-2 space-y-2">
                            {luaranTambahan.map((luaran, index) => (
                                <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md text-sm">
                                    <span className="text-gray-800">{luaran}</span>
                                    <button type="button" onClick={() => handleRemoveLuaran(index)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Unggah Berkas Wajib</label>
                        <div className="space-y-4">
                            {documentsToDisplay.map((doc: any) => (
                                <div key={doc.id}>
                                    <label htmlFor={`file-${doc.id}`} className="block text-sm text-gray-600">
                                        {doc.name} {doc.isRequired && <span className="text-red-500">*</span>}
                                    </label>
                                    <input id={`file-${doc.id}`} type="file" onChange={(e) => handleFileChange(doc.id, e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" accept=".pdf,.doc,.docx" />
                                    {files[doc.id] && <p className="mt-1 text-xs text-green-600">{files[doc.id].name}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-5 border-t flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="btn-secondary">Batal</button>
                    <button type="submit" className="btn-primary flex items-center">
                        <BookOpenCheck className="w-4 h-4 mr-2"/> Kirim Proposal Lengkap
                    </button>
                </div>
            </form>
        </Modal>
    );
};
export default CompleteProposalModal;