// src/components/dashboard/LogbookMonitoring.tsx
"use client";

import { Proposal, User } from "@/types";
import { Eye } from "lucide-react";
import React from "react";

interface LogbookMonitoringProps {
    proposals: Proposal[];
    users: User[];
    onViewLogbook: (proposal: Proposal) => void;
}

const LogbookMonitoring = ({ proposals, users, onViewLogbook }: LogbookMonitoringProps) => {
    const fundedProposals = proposals.filter(p => p.status === 'Didanai');

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Monitoring Logbook Proposal Didanai</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Proposal</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ketua Tim</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Entri</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {fundedProposals.length > 0 ? fundedProposals.map(p => (
                            <tr key={p.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.judul}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{p.ketua.namaLengkap}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-700 text-center">{p.logbookEntries?.length || 0}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button onClick={() => onViewLogbook(p)} className="btn-secondary text-xs flex items-center">
                                        <Eye size={14} className="mr-1"/>Lihat Logbook
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={4} className="text-center py-4 text-gray-500">Belum ada proposal yang didanai.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LogbookMonitoring;
