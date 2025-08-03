// src/components/modals/ProgressReportModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Proposal } from '@/types';
import Modal from '@/components/common/Modal';
import { UploadCloud, Link as LinkIcon, Paperclip } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProgressReportModalProps {
    proposal: Proposal;
    onClose: () => void;
    onSubmit: (proposalId: number, data: any) => void;
    isReadOnly?: boolean;
    isFinalReport?: boolean;
}

const ProgressReportModal = ({ proposal, onClose, onSubmit, isReadOnly = false, isFinalReport= false }: ProgressReportModalProps) => {
    
    const [progress, setProgress] = useState({
        luaranWajib: (proposal.detailProposal as any)?.luaranWajibProgress || {},
        luaranTambahan: (proposal.detailProposal as any)?.luaranTambahanProgress || {}
    });

    const [filesToUpload, setFilesToUpload] = useState<Record<string, File>>({});
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setProgress({
            luaranWajib: (proposal.detailProposal as any)?.luaranWajibProgress || {},
            luaranTambahan: (proposal.detailProposal as any)?.luaranTambahanProgress || {}
        });
    }, [proposal]);

    const handleInputChange = (type: 'luaranWajib' | 'luaranTambahan', index: number, field: string, value: string) => {
        setProgress(prev => {
            const newProgress = JSON.parse(JSON.stringify(prev));
            if (!newProgress[type][index]) {
                newProgress[type][index] = {};
            }
            newProgress[type][index][field] = value;
            return newProgress;
        });
    };

    const handleFileChange = (type: 'luaranWajib' | 'luaranTambahan', index: number, file: File | null) => {
        if (file) {
            handleInputChange(type, index, 'fileName', file.name);
            setFilesToUpload(prev => ({ ...prev, [`${type}-${index}`]: file }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        const toastId = toast.loading('Mempersiapkan unggahan luaran...');

        try {
            const newProgress = JSON.parse(JSON.stringify(progress));
            const filesToUploadEntries = Object.entries(filesToUpload);

            for (let i = 0; i < filesToUploadEntries.length; i++) {
                const [key, file] = filesToUploadEntries[i];
                toast.loading(`Mengunggah file ${i + 1}/${filesToUploadEntries.length}: ${file.name}`, { id: toastId });

                const [type, indexStr] = key.split('-');
                const index = parseInt(indexStr);

                const signedUrlResponse = await fetch('/api/uploads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileName: file.name, proposalId: proposal.id }),
                });
                if (!signedUrlResponse.ok) throw new Error('Gagal mendapatkan izin unggah.');
                const { signedUrl, publicUrl } = await signedUrlResponse.json();

                const uploadResponse = await fetch(signedUrl, {
                    method: 'PUT',
                    body: file,
                    headers: { 'Content-Type': file.type },
                });
                if (!uploadResponse.ok) throw new Error(`Gagal mengunggah ${file.name}.`);

                newProgress[type as 'luaranWajib' | 'luaranTambahan'][index].fileUrl = publicUrl;
                delete newProgress[type as 'luaranWajib' | 'luaranTambahan'][index].url;
            }
            
            toast.loading('Menyimpan laporan...', { id: toastId });
            const submissionData = { 
                luaranWajibProgress: newProgress.luaranWajib, 
                luaranTambahanProgress: newProgress.luaranTambahan 
            };
            
            await onSubmit(proposal.id, submissionData);
            toast.success('Laporan berhasil disimpan!', { id: toastId });
        } catch (error: any) {
            toast.error(error.message, { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    const statusOptions = ['Draft', 'Submitted', 'Accepted', 'Published'];
    const modalTitle = isFinalReport ? 'Laporan Akhir Luaran' : 'Laporan Kemajuan Luaran';
    const submitButtonText = isFinalReport ? 'Kirim Laporan Akhir' : 'Simpan Laporan';

    const renderOutputSection = (title: string, outputs: string[], type: 'luaranWajib' | 'luaranTambahan') => (
        <div>
            <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800">{title}</h3>
            <div className="space-y-6">
                {outputs.map((output, index) => {
                    const currentProgress = progress[type]?.[index] || {};
                    return (
                        <div key={index} className="bg-white p-4 rounded-lg border grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            <div className="md:col-span-4"><p className="font-semibold text-gray-800">{output}</p></div>
                            <div className="md:col-span-3">
                                <label className="block text-xs font-medium text-gray-700">Status</label>
                                <select value={currentProgress.status || ''} onChange={(e) => handleInputChange(type, index, 'status', e.target.value)} className="mt-1 input-field text-sm text-gray-900" disabled={isReadOnly}>
                                    <option value="">-- Pilih Status --</option>
                                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-5">
                                <label className="block text-xs font-medium text-gray-700">Berkas & Tautan</label>
                                <div className="flex flex-col space-y-2 mt-1">
                                    <input type="file" onChange={(e) => handleFileChange(type, index, e.target.files ? e.target.files[0] : null)} className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" disabled={isReadOnly} />
                                    {currentProgress.fileName && <p className="text-xs text-green-700 truncate flex items-center"><Paperclip size={12} className="mr-1.5 flex-shrink-0"/>{currentProgress.fileName}</p>}
                                    {currentProgress.url && <a href={currentProgress.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate flex items-center"><LinkIcon size={12} className="mr-1.5 flex-shrink-0"/>{decodeURIComponent(currentProgress.url).split('/').pop()}</a>}
                                    {!currentProgress.fileName && !currentProgress.url && <p className="text-xs text-gray-500">No File Chosen</p>}
                                    {currentProgress.status === 'Published' && !isReadOnly && <input type="url" placeholder="https://... (URL Publikasi)" value={currentProgress.url || ''} onChange={(e) => handleInputChange(type, index, 'url', e.target.value)} className="input-field text-sm text-gray-900"/>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <Modal onClose={onClose} size="5xl">
            <form onSubmit={handleSubmit} className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{modalTitle}</h2>
                <p className="text-gray-600 mb-6">Proposal: <span className="font-semibold">{proposal.judul}</span></p>
                <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4">
                    {renderOutputSection("Luaran Wajib", proposal.program.detailLainnya.outputs, 'luaranWajib')}
                    {(proposal.detailProposal as any)?.luaranTambahan?.length > 0 && 
                        renderOutputSection("Luaran Tambahan", (proposal.detailProposal as any).luaranTambahan, 'luaranTambahan')
                    }
                </div>
                <div className="mt-8 pt-5 border-t flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="btn-secondary" disabled={isUploading}>
                        {isReadOnly ? 'Tutup' : 'Batal'}
                    </button>
                    {!isReadOnly && (
                        <button type="submit" className="btn-primary flex items-center" disabled={isUploading}>
                            {isUploading ? 'Menyimpan...' : (
                                <>
                                    <UploadCloud size={16} className="mr-2"/> {submitButtonText}
                                </>
                            )}
                        </button>
                    )}
                </div>
            </form>
        </Modal>
    );
};

export default ProgressReportModal;