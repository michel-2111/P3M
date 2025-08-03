// src/components/modals/ProposalRevisionModal.tsx
"use client";

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Proposal, Review, User } from '@/types';
import Modal from '@/components/common/Modal';
import { MessageSquareWarning } from 'lucide-react';

interface ProposalRevisionModalProps {
    proposal: Proposal;
    reviews: Review[];
    users: User[];
    settings: any;
    onClose: () => void;
    onSubmit: (proposalId: number, data: any) => void;
}

const ProposalRevisionModal = ({ proposal, reviews, users, settings, onClose, onSubmit }: ProposalRevisionModalProps) => {
    const [judul, setJudul] = useState(proposal.judul);
    const [abstrak, setAbstrak] = useState(proposal.abstrak);
    const [details, setDetails] = useState(proposal.detailProposal || {});
    const [files, setFiles] = useState<Record<string, File>>({});
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setJudul(proposal.judul);
        setAbstrak(proposal.abstrak);
        setDetails(proposal.detailProposal || {});
    }, [proposal]);

    const relevantReviews = reviews.filter(r => r.proposalId === proposal.id && r.catatan);
    const program = proposal.program;
    const isPenelitian = program.kategori === 'Penelitian';
    
    const fieldsToRender = (isPenelitian 
        ? settings.proposal_details?.penelitian 
        : settings.proposal_details?.pengabdian) ?? [];

    const handleDetailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDetails((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (docId: string, file: File | null) => {
        if (file) { setFiles(prev => ({ ...prev, [docId]: file })); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        const toastId = toast.loading('Mempersiapkan unggahan file revisi...');
        
        try {
            const dokumenDiunggah = { ...proposal.dokumenDiunggah };

            const filesToUpload = Object.entries(files);
            for (let i = 0; i < filesToUpload.length; i++) {
                const [docId, file] = filesToUpload[i];
                toast.loading(`Mengunggah file ${i + 1}/${filesToUpload.length}: ${file.name}`, { id: toastId });

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
                if (!uploadResponse.ok) throw new Error(`Gagal mengunggah file ${file.name}`);
                
                dokumenDiunggah[docId] = publicUrl;
            }

            toast.loading('Menyimpan perbaikan proposal...', { id: toastId });

            const submissionData = {
                judul,
                abstrak,
                detailProposal: details,
                dokumenDiunggah,
            };

            await onSubmit(proposal.id, submissionData);
            toast.success('Proposal berhasil diperbaiki!', { id: toastId });
        } catch (error: any) {
            toast.error(error.message, { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Modal onClose={onClose} size="4xl">
            <form onSubmit={handleSubmit} className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Perbaiki Proposal</h2>
                <p className="text-gray-600 mb-6">Status Saat Ini: <span className="font-semibold text-purple-600">{proposal.status}</span></p>
                
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md">
                        <h3 className="font-bold flex items-center"><MessageSquareWarning className="w-5 h-5 mr-2"/>Catatan dari Reviewer</h3>
                        {relevantReviews.length > 0 ? (
                            <ul className="mt-2 space-y-2">
                                {relevantReviews.map(review => {
                                    const reviewer = users.find(u => u.id === review.reviewerId);
                                    return (
                                        <li key={review.id} className="text-sm">
                                            <strong className="text-yellow-900">{reviewer?.namaLengkap || 'Reviewer'}:</strong>
                                            <p className="italic">"{review.catatan}"</p>
                                        </li>
                                    )
                                })}
                            </ul>
                        ) : <p className="italic mt-1">"Tidak ada catatan umum."</p>}
                    </div>

                    <div>
                        <label htmlFor="judul-revisi" className="block text-sm font-medium text-gray-700">Judul Proposal</label>
                        <input id="judul-revisi" type="text" value={judul} onChange={(e) => setJudul(e.target.value)} className="mt-1 input-field text-gray-900" required />
                    </div>
                    <div>
                        <label htmlFor="abstrak-revisi" className="block text-sm font-medium text-gray-700">Abstrak</label>
                        <textarea id="abstrak-revisi" value={abstrak} onChange={(e) => setAbstrak(e.target.value)} className="mt-1 input-field text-gray-900" rows={4} required />
                    </div>
                    
                    {/* Render field dinamis */}
                    {fieldsToRender.map((field: any) => (
                        <div key={field.id}>
                            <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
                                {field.label} {field.isRequired && <span className="text-red-500">*</span>}
                            </label>
                            <textarea name={field.key} id={field.key} value={details[field.key] || ''} onChange={handleDetailChange} className="mt-1 input-field text-gray-900" rows={6} required={field.isRequired} />
                        </div>
                    ))}

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Unggah Ulang Berkas</h3>
                        <div className="space-y-4">
                            {Object.entries(proposal.dokumenDiunggah || {}).map(([docId, docName]) => (
                                <div key={docId}>
                                    <label htmlFor={`file-revisi-${docId}`} className="block text-sm text-gray-600">
                                        Berkas saat ini: <span className='font-semibold'>{docName as string}</span>
                                    </label>
                                    <input 
                                        id={`file-revisi-${docId}`} 
                                        type="file" 
                                        onChange={(e) => handleFileChange(docId, e.target.files ? e.target.files[0] : null)} 
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                                        accept=".pdf,.doc,.docx" 
                                    />
                                    {files[docId] && <p className="mt-1 text-xs text-green-600">File baru: {files[docId].name}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-5 border-t flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="btn-secondary" disabled={isUploading}>Batal</button>
                    <button type="submit" className="btn-primary" disabled={isUploading}>
                        {isUploading ? 'Menyimpan...' : 'Kirim Perbaikan'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ProposalRevisionModal;
