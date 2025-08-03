// src/components/dashboard/TitleApprovalTasks.tsx
"use client";

import { Proposal } from "@/types";
import { Check, Eye, FileText, X } from "lucide-react";
import React from "react";

interface TitleApprovalTasksProps {
    proposals: Proposal[];
    onDecision: (proposalId: number, decision: 'approve' | 'reject') => void;
    onDetailClick: (proposal: Proposal) => void;
}

const TitleApprovalTasks = ({ proposals, onDecision, onDetailClick }: TitleApprovalTasksProps) => {
    const tasks = proposals.filter(p => p.status === 'Menunggu Persetujuan Judul');

    if (tasks.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-blue-500"/> Tugas Persetujuan Judul
            </h2>
            <div className="space-y-4">
                {tasks.map(p => (
                    <div key={p.id} className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-bold text-lg text-blue-900">{p.judul}</p>
                            <p className="text-sm text-blue-700">Ketua Tim: {p.ketua.namaLengkap}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            {/* Tombol Detail Baru */}
                            <button onClick={() => onDetailClick(p)} className="btn-secondary text-xs">
                                <Eye className="w-4 h-4"/>
                            </button>
                            <button onClick={() => onDecision(p.id, 'reject')} className="btn-secondary bg-red-200 text-red-800 hover:bg-red-300 p-2 rounded-full">
                                <X className="w-5 h-5"/>
                            </button>
                            <button onClick={() => onDecision(p.id, 'approve')} className="btn-primary bg-green-600 hover:bg-green-700 p-2 rounded-full">
                                <Check className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TitleApprovalTasks;
