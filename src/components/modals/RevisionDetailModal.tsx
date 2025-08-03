// src/components/modals/RevisionDetailModal.tsx
"use client";

import React from 'react';
import { Proposal, FinalDecision, Setting} from '@/types';
import Modal from '@/components/common/Modal';
import { FileText, ThumbsDown, ThumbsUp, Users } from 'lucide-react';

interface RevisionDetailModalProps {
    proposal: Proposal;
    settings: Setting;
    onClose: () => void;
    onDecision: (proposalId: number, decision: FinalDecision, reviewNotes: string[]) => void;
}

const DetailSection = ({ title, content }: { title: string, content: string | undefined }) => {
    if (!content) return null;
    return (
        <div className="mt-4">
            <h4 className="font-semibold text-gray-700">{title}</h4>
            <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-md mt-1 whitespace-pre-wrap">{content}</p>
        </div>
    );
};


const RevisionDetailModal = ({ proposal, onClose, onDecision, settings }: RevisionDetailModalProps) => {
    const reviewNotes = (proposal.detailProposal as any)?.catatanReviewer || [];

    const isPenelitian = proposal.program.kategori === 'Penelitian';
    const fieldsToRender = (isPenelitian 
        ? settings.proposal_details?.penelitian 
        : settings.proposal_details?.pengabdian) ?? [];

    return (
        <Modal onClose={onClose} size="4xl">
            <div className="p-8">
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                    <DetailSection title="Judul Revisi" content={proposal.judul} />
                    <DetailSection title="Abstrak Revisi" content={proposal.abstrak} />

                    {fieldsToRender.map((field: any) => (
                        <DetailSection 
                            key={field.id}
                            title={field.label}
                            content={proposal.detailProposal?.[field.key]}
                        />
                    ))}

                    <div>
                        <h3 className="detail-header mt-4"><Users className="w-5 h-5 mr-2"/>Dokumen Terunggah</h3>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                            {Object.entries(proposal.dokumenDiunggah || {}).map(([key, value]) => (
                                <li key={key} className="text-sm">
                                    <a href="#" className="text-blue-600 hover:underline">{value as string}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-5 border-t flex justify-end space-x-3">
                    <button onClick={() => onDecision(proposal.id, 'Ditolak', reviewNotes)} className="btn-secondary bg-red-600 text-white hover:bg-red-700 flex items-center">
                        <ThumbsDown size={16} className="mr-2"/> Tolak
                    </button>
                    <button onClick={() => onDecision(proposal.id, 'Didanai', reviewNotes)} className="btn-primary bg-green-600 hover:bg-green-700 flex items-center">
                        <ThumbsUp size={16} className="mr-2"/> Danai Proposal
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default RevisionDetailModal;
