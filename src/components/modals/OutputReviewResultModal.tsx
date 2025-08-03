// src/components/modals/OutputReviewResultModal.tsx
"use client";

import React from 'react';
import { Proposal, Review, User as UserType, ReviewType } from '@/types';
import Modal from '@/components/common/Modal';
import { CheckCircle, XCircle, User, ThumbsUp, ThumbsDown } from 'lucide-react';

interface OutputReviewResultModalProps {
    proposal: Proposal;
    reviews: Review[];
    users: UserType[];
    type: 'OUTPUT_KEMAJUAN' | 'OUTPUT_AKHIR';
    onClose: () => void;
    onDecision: (proposalId: number, decision: 'Lengkap' | 'Tidak Lengkap', type: 'OUTPUT_KEMAJUAN' | 'OUTPUT_AKHIR') => void;
}

const OutputReviewResultModal: React.FC<OutputReviewResultModalProps> = ({
    proposal,
    reviews,
    users,
    type,
    onClose,
    onDecision,
}) => {
    
    const getReviewerName = (reviewerId: string) => {
        return users.find(u => u.id === reviewerId)?.namaLengkap || 'Reviewer Tidak Dikenal';
    };

    const title = type === 'OUTPUT_KEMAJUAN' 
        ? 'Hasil Review Laporan Kemajuan' 
        : 'Hasil Review Laporan Akhir';

    return (
        <Modal onClose={onClose} size="3xl">
            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
                <p className="text-gray-600 mb-6">
                    Proposal: <span className="font-semibold">{proposal.judul}</span>
                </p>

                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-4">
                    {reviews.length > 0 ? reviews.map((review, index) => (
                        <div key={review.id} className="bg-gray-50 p-4 border rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                                    <User className="w-5 h-5 mr-2" />
                                    Reviewer {index + 1}: {getReviewerName(review.reviewerId)}
                                </h3>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm mb-2 pb-2 border-b">
                                <span className="font-semibold text-gray-700">Total Skor: {review.totalSkor || 0}</span>
                                {review.rekomendasi === 'Valid' ? (
                                    <span className="font-bold text-green-600 flex items-center"><CheckCircle size={18} className="mr-1.5"/> Lengkap</span>
                                ) : (
                                    <span className="font-bold text-red-600 flex items-center"><XCircle size={18} className="mr-1.5"/> Tidak Lengkap</span>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 italic bg-white p-2 rounded">
                                "{review.catatan || 'Tidak ada catatan.'}"
                            </p>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 py-4">Belum ada data review untuk luaran ini.</p>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Buat Keputusan Final</h3>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Batal
                        </button>
                        <button 
                            type="button" 
                            onClick={() => onDecision(proposal.id, 'Tidak Lengkap', type)}
                            className="btn-primary bg-red-600 hover:bg-red-700 flex items-center"
                        >
                            <ThumbsDown className="w-4 h-4 mr-2" />
                            Tidak Lengkap
                        </button>
                        <button 
                            type="button" 
                            onClick={() => onDecision(proposal.id, 'Lengkap', type)}
                            className="btn-primary bg-green-600 hover:bg-green-700 flex items-center"
                        >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Lengkap & Diterima
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default OutputReviewResultModal;