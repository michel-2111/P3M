// src/components/dashboard/AdminDashboard.tsx
"use client";

import { Proposal, Review } from "@/types";
import React from "react";
import TitleApprovalTasks from "./TitleApprovalTasks";
import { CheckSquare, Eye, UserCheck, Download } from "lucide-react";

interface AdminDashboardProps {
    proposals: Proposal[];
    reviews: Review[];
    onTitleDecision: (proposalId: number, decision: 'approve' | 'reject') => void;
    onDetailClick: (proposal: Proposal) => void;
    onAssignReviewersClick: (proposal: Proposal, type: 'SUBSTANCE' | 'OUTPUT') => void;
    onViewResultsClick: (proposal: Proposal) => void;
    onViewRevisionClick: (proposal: Proposal) => void;
}

const AdminDashboard = ({ 
    proposals, 
    reviews, 
    onTitleDecision, 
    onDetailClick, 
    onAssignReviewersClick, 
    onViewResultsClick, 
    onViewRevisionClick 
}: AdminDashboardProps) => {
    
    const submittedProposals = proposals.filter(p => p.status === 'Diajukan');
    const reviewingProposals = proposals.filter(p => p.status === 'Direview');
    const revisedProposals = proposals.filter(p => p.status === 'Direvisi');

    // Fungsi handleExport sekarang menerima ID proposal
    const handleExport = (proposalId: number) => {
        window.location.href = `/api/proposals/${proposalId}/export-review`;
    };

    return (
        <div className="space-y-6">
            <TitleApprovalTasks proposals={proposals} onDecision={onTitleDecision} onDetailClick={onDetailClick} />

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Manajemen Proposal Masuk</h2>
                    {/* Tombol export global sudah dihapus */}
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ketua Tim</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {submittedProposals.map(p => (
                                <tr key={p.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.judul}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{p.ketua.namaLengkap}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className="badge-blue">{p.status}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => onAssignReviewersClick(p, 'SUBSTANCE')} className="btn-primary text-xs flex items-center"><UserCheck size={14} className="mr-1"/> Tugaskan Reviewer</button>
                                    </td>
                                </tr>
                            ))}
                            {reviewingProposals.map(p => {
                                const completedReviews = reviews.filter(r => r.proposalId === p.id && r.rekomendasi).length;
                                const totalReviewers = reviews.filter(r => r.proposalId === p.id).length || 2;
                                const isReadyForDecision = completedReviews === totalReviewers && totalReviewers > 0;
                                return (
                                    <tr key={p.id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.judul}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{p.ketua.namaLengkap}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">{p.status} ({completedReviews}/{totalReviewers})</span></td>
                                        <td className="px-6 py-4 flex whitespace-nowrap space-x-2">
                                            {isReadyForDecision && (
                                                <>
                                                    <button onClick={() => onViewResultsClick(p)} className="btn-primary bg-teal-600 hover:bg-teal-700 text-xs flex items-center">
                                                        <CheckSquare size={14} className="mr-1"/> Lihat & Putuskan
                                                    </button>
                                                    <button onClick={() => handleExport(p.id)} className="btn-secondary text-xs flex items-center" title="Export Hasil Review">
                                                        <Download size={14} className="mr-1"/> Export
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                            {revisedProposals.map(p => (
                                <tr key={p.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.judul}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{p.ketua.namaLengkap}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">{p.status}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => onViewRevisionClick(p)} className="btn-primary bg-purple-600 hover:bg-purple-700 text-xs flex items-center">
                                            <Eye size={14} className="mr-1"/> Lihat Revisi
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;