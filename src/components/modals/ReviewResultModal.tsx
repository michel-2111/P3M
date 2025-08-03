// src/components/modals/ReviewResultModal.tsx
"use client";

import React from 'react';
import { Proposal, Review, User, FinalDecision } from '@/types';
import Modal from '@/components/common/Modal';
import { Edit, ThumbsDown, ThumbsUp } from 'lucide-react';

interface ReviewResultModalProps {
    proposal: Proposal;
    reviews: Review[];
    users: User[];
    onClose: () => void;
    onDecision: (proposalId: number, decision: FinalDecision, reviewNotes: string[]) => void;
}

const ReviewResultModal = ({ proposal, reviews, users, onClose, onDecision }: ReviewResultModalProps) => {
    const relatedReviews = reviews.filter(r => r.proposalId === proposal.id && r.rekomendasi);
    const reviewNotes = relatedReviews.map(r => r.catatan || "").filter(Boolean);
    const reviewType = relatedReviews[0]?.type;

    return (
        <Modal onClose={onClose} size="4xl">
            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Hasil Review Proposal</h2>
                <p className="text-gray-600 mb-6">Judul: <span className="font-semibold">{proposal.judul}</span></p>
                
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                    {relatedReviews.map((review, index) => {
                        const reviewer = users.find(u => u.id === review.reviewerId);
                        return (
                            <div key={review.id} className="bg-white p-4 border rounded-lg">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Reviewer {index + 1}: {reviewer?.namaLengkap}</h3>
                                    <p className="text-lg font-semibold text-blue-600">Skor: {review.totalSkor || 0}</p>
                                </div>
                                <p><strong className="font-semibold text-gray-700">Rekomendasi:</strong> <span className="font-bold text-gray-700">{review.rekomendasi}</span></p>
                                <p className="mt-2"><strong className="font-semibold text-gray-700">Catatan:</strong></p>
                                <p className="text-gray-600 italic bg-gray-100 p-2 rounded">"{review.catatan || 'Tidak ada catatan.'}"</p>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-8 pt-5 border-t flex justify-end space-x-3">
                    {reviewType === 'SUBSTANCE' && (
                        <>
                            <button onClick={() => onDecision(proposal.id, 'Ditolak', reviewNotes)} className="btn-secondary bg-red-600 text-white hover:bg-red-700 flex items-center">
                                <ThumbsDown size={16} className="mr-2"/> Tolak
                            </button>
                            <button onClick={() => onDecision(proposal.id, 'Perlu Revisi', reviewNotes)} className="btn-secondary bg-yellow-500 text-white hover:bg-yellow-600 flex items-center">
                                <Edit size={16} className="mr-2"/> Perlu Revisi
                            </button>
                            <button onClick={() => onDecision(proposal.id, 'Didanai', reviewNotes)} className="btn-primary bg-green-600 hover:bg-green-700 flex items-center">
                                <ThumbsUp size={16} className="mr-2"/> Danai Proposal
                            </button>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ReviewResultModal;
