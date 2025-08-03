// src/components/dashboard/FinalReportMonitoring.tsx
"use client";

import { Proposal, Review } from "@/types";
import { UserCheck, CheckSquare, Clock } from "lucide-react";
import React from "react";

interface FinalReportMonitoringProps {
    proposals: Proposal[];
    reviews: Review[];
    onAssignReviewers: (proposal: Proposal) => void;
    onViewOutputResults: (proposal: Proposal) => void;
}

const FinalReportMonitoring = ({ proposals, reviews, onAssignReviewers, onViewOutputResults }: FinalReportMonitoringProps) => {
    
    const finalReportProposals = proposals.filter(p => p.finalReportStatus);

    const getReviewStatus = (proposalId: number) => {
        const relatedReviews = reviews.filter(r => r.proposalId === proposalId && r.type === 'OUTPUT_AKHIR');
        if (relatedReviews.length === 0) {
            return { text: 'N/A', isComplete: false };
        }
        const completedCount = relatedReviews.filter(r => !!r.rekomendasi).length;
        return {
            text: `${completedCount}/${relatedReviews.length}`,
            isComplete: completedCount === relatedReviews.length
        };
    };

    const statusColorMap: { [key: string]: string } = {
        'SUBMITTED': 'bg-blue-100 text-blue-800',
        'IN_REVIEW': 'bg-yellow-100 text-yellow-800',
        'Lengkap': 'bg-green-100 text-green-800',
        'Tidak Lengkap': 'bg-red-100 text-red-800',
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Monitoring Laporan Akhir</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Laporan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review Selesai</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {finalReportProposals.length > 0 ? finalReportProposals.map(p => {
                            const reviewStatus = getReviewStatus(p.id);
                            return (
                                <tr key={p.id}>
                                    <td className="px-6 py-4 font-medium text-gray-900">{p.judul}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[p.finalReportStatus || ''] || 'bg-gray-100'}`}>
                                            {p.finalReportStatus?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-700">{reviewStatus.text}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            {p.finalReportStatus === 'SUBMITTED' && (
                                                <button onClick={() => onAssignReviewers(p)} className="btn-primary text-xs flex items-center">
                                                    <UserCheck size={14} className="mr-1"/> Tugaskan Reviewer
                                                </button>
                                            )}
                                            {p.finalReportStatus === 'IN_REVIEW' && reviewStatus.isComplete && (
                                                <button onClick={() => onViewOutputResults(p)} className="btn-primary bg-green-600 hover:bg-green-700 text-xs flex items-center">
                                                    <CheckSquare size={14} className="mr-1"/> Lihat Hasil & Putuskan
                                                </button>
                                            )}
                                            {p.finalReportStatus === 'IN_REVIEW' && !reviewStatus.isComplete && (
                                                <span className="text-xs italic text-gray-500 flex items-center px-2">
                                                    <Clock size={14} className="mr-1.5"/> Menunggu hasil review...
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr><td colSpan={4} className="text-center py-4 text-gray-500">Tidak ada Laporan Akhir yang perlu dimonitor.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinalReportMonitoring;