"use client";

import { Proposal, Setting, User as UserType } from "@/types";
import { BookOpenCheck, Edit, Edit3, Send, TrendingUp, Eye } from "lucide-react";
import React from "react";
import PeriodBanner from "../common/PeriodBanner";

interface MyProposalsProps {
    proposals: Proposal[];
    currentUser: UserType;
    schedules: Setting['schedules'];
    onCompleteClick: (proposal: Proposal) => void;
    onDetailClick: (proposal: Proposal) => void;
    onReviseClick: (proposal: Proposal) => void;
    onLogbookClick: (proposal: Proposal) => void;
    onProgressClick: (proposal: Proposal) => void;
    onFinalReportClick: (proposal: Proposal) => void;
}

const MyProposals = ({ 
    proposals, 
    currentUser, 
    schedules, 
    onCompleteClick, 
    onDetailClick, 
    onReviseClick, 
    onLogbookClick, 
    onProgressClick, 
    onFinalReportClick
}: MyProposalsProps) => {

    const myProposals = proposals.filter(p => 
        p.userIdKetua === currentUser.id || 
        p.anggotaTim.some(a => a.user.id === currentUser.id)
    );
    
    const getLuaranPeriodStatus = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!schedules?.luaranPeriod?.start || !schedules?.luaranPeriod?.end) {
            return 'open';
        }

        const startDate = new Date(schedules.luaranPeriod.start);
        const endDate = new Date(schedules.luaranPeriod.end);
        endDate.setHours(23, 59, 59, 999);

        if (today < startDate) return 'upcoming';
        if (today > endDate) return 'closed';
        return 'open';
    };

    const luaranPeriodStatus = getLuaranPeriodStatus();
    const hasFundedProposal = myProposals.some(p => p.status === 'Didanai');
    
    const statusColorMap: { [key: string]: string } = {
        'Menunggu Persetujuan Judul': 'bg-gray-200 text-gray-800',
        'Judul Ditolak': 'bg-red-200 text-red-800',
        'Menunggu Persetujuan Anggota': 'bg-yellow-100 text-yellow-800',
        'Menunggu Kelengkapan Dokumen': 'bg-cyan-100 text-cyan-800',
        'Diajukan': 'bg-blue-100 text-blue-800',
        'Direview': 'bg-orange-100 text-orange-800',
        'Perlu Revisi': 'bg-purple-100 text-purple-800',
        'Didanai': 'bg-green-100 text-green-800',
        'Ditolak': 'bg-red-100 text-red-800',
        'Selesai': 'bg-gray-500 text-white',
    };

    return (
        <div className="space-y-6">
            {hasFundedProposal && (
                <PeriodBanner
                    period={schedules?.luaranPeriod}
                    periodStatus={luaranPeriodStatus}
                    openText="Periode Pelaporan Luaran Sedang Berlangsung"
                    closedText="Periode Pelaporan Luaran Telah Ditutup"
                    upcomingText="Periode Pelaporan Luaran Akan Datang"
                />
            )}
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Keterlibatan Proposal Saya</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peran Saya</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {myProposals.length > 0 ? myProposals.map(p => {
                                const isLeader = p.userIdKetua === currentUser.id;
                                
                                const isProjectActive = p.status === 'Didanai';
                                const canSubmitFinalReport = isProjectActive && p.progressReportStatus === 'Lengkap' && !p.finalReportStatus;
                                const needsProgressRevision = isProjectActive && p.progressReportStatus === 'Tidak Lengkap';

                                const isOutsideReportingPeriod = luaranPeriodStatus !== 'open';
                                let disabledTitle = "";
                                if (luaranPeriodStatus === 'closed') disabledTitle = "Periode pelaporan telah ditutup.";
                                if (luaranPeriodStatus === 'upcoming') disabledTitle = "Periode pelaporan belum dibuka.";

                                return (
                                    <tr key={p.id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.judul}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">{isLeader ? 'Ketua' : 'Anggota'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[p.status] || 'bg-gray-100 text-gray-800'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <button onClick={() => onDetailClick(p)} className="btn-secondary text-xs">Lihat Detail</button>
                                                
                                                {isLeader && p.status === 'Menunggu Kelengkapan Dokumen' && (
                                                    <button onClick={() => onCompleteClick(p)} className="btn-primary bg-indigo-500 hover:bg-indigo-600 text-xs flex items-center"><Edit3 size={14} className="mr-1"/>Lengkapi</button>
                                                )}
                                                {isLeader && p.status === 'Perlu Revisi' && (
                                                    <button onClick={() => onReviseClick(p)} className="btn-primary bg-yellow-500 hover:bg-yellow-600 text-xs flex items-center"><Edit size={14} className="mr-1"/>Perbaiki</button>
                                                )}
                                                
                                                {isLeader && isProjectActive && (
                                                    <>
                                                        <button onClick={() => onLogbookClick(p)} className="btn-primary bg-teal-500 hover:bg-teal-600 text-xs flex items-center" disabled={isOutsideReportingPeriod} title={disabledTitle}>
                                                            <BookOpenCheck size={14} className="mr-1"/>Logbook
                                                        </button>
                                                        <button onClick={() => onProgressClick(p)} className="btn-primary bg-sky-500 hover:bg-sky-600 text-xs flex items-center" disabled={isOutsideReportingPeriod || needsProgressRevision} title={needsProgressRevision ? "Laporan kemajuan Anda perlu diperbaiki." : disabledTitle}>
                                                            {needsProgressRevision ? "Perbaiki Laporan" : "Lapor Kemajuan"}
                                                        </button>
                                                    </>
                                                )}
                                                {isLeader && canSubmitFinalReport && (
                                                    <button onClick={() => onFinalReportClick(p)} className="btn-primary bg-green-600 hover:bg-green-700 text-xs flex items-center" disabled={isOutsideReportingPeriod} title={disabledTitle}>
                                                        <Send size={14} className="mr-1"/>Lapor Akhir
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr><td colSpan={4} className="text-center py-4 text-gray-500">Anda belum terlibat dalam proposal apapun.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyProposals;