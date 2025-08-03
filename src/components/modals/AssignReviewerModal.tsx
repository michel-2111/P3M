// src/components/modals/AssignReviewerModal.tsx
"use client";

import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Proposal, ReviewType, User as UserType } from '@/types';
import Modal from '@/components/common/Modal';
import { PlusCircle, Trash2 } from 'lucide-react';

interface AssignReviewerModalProps {
    proposal: Proposal;
    users: UserType[];
    type: ReviewType;
    onClose: () => void;
    onAssign: (proposalId: number, reviewerIds: string[], type: ReviewType) => void;
}

const reviewerConfig = {
    SUBSTANCE: { count: 1, title: 'Tugaskan Reviewer Substansi' },
    OUTPUT_KEMAJUAN: { count: 1, title: 'Tugaskan Reviewer Laporan Kemajuan' },
    OUTPUT_AKHIR: { count: 1, title: 'Tugaskan Reviewer Laporan Akhir' }
};

const MAX_REVIEWERS = 4;

const AssignReviewerModal = ({ proposal, users, type, onClose, onAssign }: AssignReviewerModalProps) => {
    const config = reviewerConfig[type];
    const [reviewerIds, setReviewerIds] = useState<string[]>(Array(config.count).fill(''));

    const handleReviewerChange = (index: number, value: string) => {
        const newReviewerIds = [...reviewerIds];
        newReviewerIds[index] = value;
        setReviewerIds(newReviewerIds);
    };

    const addReviewerSlot = () => {
        if (reviewerIds.length < MAX_REVIEWERS) {
            setReviewerIds([...reviewerIds, '']);
        } else {
            toast.error(`Anda hanya dapat menambahkan maksimal ${MAX_REVIEWERS} reviewer.`);
        }
    };

    const removeReviewerSlot = (indexToRemove: number) => {
        if (reviewerIds.length > 1) {
            setReviewerIds(reviewerIds.filter((_, index) => index !== indexToRemove));
        }
    };

    const teamMemberIds = useMemo(() => [
        proposal.userIdKetua, ...proposal.anggotaTim.map(a => a.user.id)
    ], [proposal]);

    const availableReviewers = useMemo(() => {

        const requiredRole = proposal.kategori === 'Pengabdian' 
            ? 'reviewer_penelitian' 
            : 'reviewer_pengabdian';
        
        return users.filter(u => 
            u.peran.includes(requiredRole) && !teamMemberIds.includes(u.id)
        );
    }, [users, teamMemberIds, proposal.kategori]);

    const handleAssign = () => {
        if (reviewerIds.some(id => id === '')) {
            toast.error(`Harap isi semua pilihan reviewer.`);
            return;
        }
        const uniqueReviewerIds = new Set(reviewerIds);
        if (uniqueReviewerIds.size !== reviewerIds.length) {
            toast.error('Reviewer tidak boleh orang yang sama.');
            return;
        }
        
        onAssign(proposal.id, reviewerIds, type);
    };

    return (
        <Modal onClose={onClose} size="2xl">
            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{config.title}</h2>
                <p className="text-gray-600 mb-6">Untuk proposal: <span className="font-semibold text-gray-900">{proposal.judul}</span></p>
                
                <div className="space-y-4">
                    {reviewerIds.map((id, index) => (
                        <div key={index}>
                            <label className="block text-sm font-medium text-gray-700">
                                {reviewerIds.length > 1 ? `Pilih Reviewer ${index + 1}` : 'Pilih Validator'}
                            </label>
                            <div className="flex items-center space-x-2 mt-1">
                                <select 
                                    value={id} 
                                    onChange={(e) => handleReviewerChange(index, e.target.value)} 
                                    className="input-field text-gray-900 flex-grow"
                                >
                                    <option value="">-- Pilih Dosen --</option>
                                    {availableReviewers.length > 0 ? (
                                        availableReviewers.map(d => <option key={d.id} value={d.id}>{d.namaLengkap}</option>)
                                    ) : (
                                        <option value="" disabled>Tidak ada reviewer yang tersedia</option>
                                    )}
                                </select>
                                {reviewerIds.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => removeReviewerSlot(index)} 
                                        className="text-red-500 hover:text-red-700 p-2"
                                        title="Hapus Reviewer"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {reviewerIds.length < MAX_REVIEWERS && (
                    <div className="mt-4">
                        <button 
                            type="button" 
                            onClick={addReviewerSlot} 
                            className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center"
                        >
                            <PlusCircle size={16} className="mr-2"/>
                            Tambah Reviewer
                        </button>
                    </div>
                )}
                
                <div className="mt-8 pt-5 border-t flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="btn-secondary">Batal</button>
                    <button type="button" onClick={handleAssign} className="btn-primary">Tugaskan</button>
                </div>
            </div>
        </Modal>
    );
};

export default AssignReviewerModal;