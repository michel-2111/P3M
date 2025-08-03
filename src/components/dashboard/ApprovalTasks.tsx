// src/components/dashboard/ApprovalTasks.tsx
"use client";

import { Proposal, User as UserType } from "@/types";
import { Bell, ThumbsUp } from "lucide-react";
import React from "react";

interface ApprovalTasksProps {
    proposals: Proposal[];
    currentUser: UserType;
    onApprove: (proposalId: number) => void;
}

const ApprovalTasks = ({ proposals, currentUser, onApprove }: ApprovalTasksProps) => {
    const tasks = proposals.filter(p => 
        p.status === 'Menunggu Persetujuan Anggota' && 
        p.anggotaTim.some(a => a.user.id === currentUser.id && a.statusPersetujuan === 'Menunggu')
    );

    if (tasks.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Bell className="w-6 h-6 mr-3 text-yellow-500"/> Tugas Persetujuan Proposal
            </h2>
            <div className="space-y-4">
                {tasks.map(p => (
                    <div key={p.id} className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-bold text-lg text-yellow-900">{p.judul}</p>
                            <p className="text-sm text-yellow-700">Ketua Tim: {p.ketua.namaLengkap}</p>
                        </div>
                        <button onClick={() => onApprove(p.id)} className="btn-primary flex items-center bg-green-600 hover:bg-green-700">
                            <ThumbsUp className="w-4 h-4 mr-2"/>Setujui
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApprovalTasks;
