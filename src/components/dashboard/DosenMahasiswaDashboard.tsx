// src/components/dashboard/DosenMahasiswaDashboard.tsx
"use client";

import React, { useState } from 'react';
import { Program, Proposal, Setting, User as UserType } from '@/types';
import ProgramDetailModal from '@/components/modals/ProgramDetailModal';
import ProposalSubmitModal from '@/components/modals/ProposalSubmitModal';
import { Eye, PlusCircle } from 'lucide-react';
import PeriodBanner from '../common/PeriodBanner';

interface DosenMahasiswaDashboardProps {
    programs: Program[];
    currentUser: UserType;
    users: UserType[];
    proposals: Proposal[];
    schedules: Setting['schedules'];
    onSubmitProposal: (data: any) => void;
}

const DosenMahasiswaDashboard = ({ programs, currentUser, users, proposals, schedules, onSubmitProposal }: DosenMahasiswaDashboardProps) => {
    const [detailProgram, setDetailProgram] = useState<Program | null>(null);
    const [submissionModalProgram, setSubmissionModalProgram] = useState<Program | null>(null);

    const getPeriodStatus = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!schedules?.proposalPeriod?.start || !schedules?.proposalPeriod?.end) {
            return 'open';
        }

        const startDate = new Date(schedules.proposalPeriod.start);
        const endDate = new Date(schedules.proposalPeriod.end);
        endDate.setHours(23, 59, 59, 999);

        if (today < startDate) return 'upcoming';
        if (today > endDate) return 'closed';
        return 'open';
    };

    const periodStatus = getPeriodStatus();

    const checkUserProposalLimits = (userId: string) => {
        const limits = {
            Penelitian: { asLeader: 0, asMember: 0 },
            Pengabdian: { asLeader: 0, asMember: 0 },
        };
        proposals.forEach(p => {
            if (['Ditolak', 'Selesai'].includes(p.status)) return;
            const category = p.program.kategori as 'Penelitian' | 'Pengabdian';
            if (p.userIdKetua === userId) {
                limits[category].asLeader++;
            } else if (p.anggotaTim.some(a => a.user.id === userId)) {
                limits[category].asMember++;
            }
        });
        return limits;
    };

    const userLimits = checkUserProposalLimits(currentUser.id);
    const allowedRole = currentUser.peran.includes('dosen') ? 'dosen' : 'mahasiswa';
    const relevantPrograms = programs.filter(p => (p.detailLainnya as any)?.allowedRoles?.includes(allowedRole));

    return (
        <>
            <PeriodBanner
                period={schedules?.proposalPeriod}
                periodStatus={periodStatus}
                openText="Periode Pengajuan Proposal Sedang Berlangsung"
                closedText="Periode Pengajuan Proposal Telah Ditutup"
                upcomingText="Periode Pengajuan Proposal Akan Datang"
            />

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Pilihan Skema Program</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relevantPrograms.map(program => {
                        const category = program.kategori as 'Penelitian' | 'Pengabdian';
                        const limitsForCategory = userLimits[category];
                        const totalInvolvement = limitsForCategory.asLeader + limitsForCategory.asMember;
                        const cannotBeLeader = limitsForCategory.asLeader >= 1 || totalInvolvement >= 2;

                        const isDisabled = periodStatus !== 'open' || cannotBeLeader;
                        let disabledTitle = "";
                        if (periodStatus === 'closed') {
                            disabledTitle = "Periode pengajuan proposal telah ditutup.";
                        } else if (periodStatus === 'upcoming') {
                            disabledTitle = "Periode pengajuan proposal belum dibuka.";
                        } else if (cannotBeLeader) {
                            if (limitsForCategory.asLeader >= 1) {
                                disabledTitle = `Batas tercapai: Anda sudah menjadi ketua di 1 proposal ${category}.`;
                            } else if (totalInvolvement >= 2) {
                                disabledTitle = `Batas tercapai: Anda sudah terlibat dalam 2 proposal ${category}.`;
                            }
                        }

                        return (
                            <div key={program.id} className="bg-gray-50 border p-4 rounded-lg flex flex-col justify-between hover:border-blue-500 transition-colors shadow-sm">
                                <div>
                                    <span className={`text-xs font-bold uppercase tracking-wider ${program.kategori === 'Penelitian' ? 'text-blue-600' : 'text-green-600'}`}>{program.kategori}</span>
                                    <h3 className="text-md font-bold mt-1 text-gray-800">{program.namaProgram}</h3>
                                    <p className="text-sm text-gray-500 mt-2">({program.id})</p>
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                                    <button onClick={() => setDetailProgram(program)} className="text-sm text-blue-600 hover:underline flex items-center font-semibold"><Eye className="w-4 h-4 mr-1"/>Lihat Detail</button>
                                    <button 
                                        onClick={() => setSubmissionModalProgram(program)} 
                                        className="btn-primary flex items-center justify-center text-sm ml-2"
                                        disabled={isDisabled}
                                        title={disabledTitle}
                                    >
                                        <PlusCircle className="w-4 h-4 mr-1"/>Ajukan
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {detailProgram && <ProgramDetailModal program={detailProgram} onClose={() => setDetailProgram(null)} />}
            {submissionModalProgram && <ProposalSubmitModal program={submissionModalProgram} users={users} currentUser={currentUser} onClose={() => setSubmissionModalProgram(null)} onSubmit={onSubmitProposal} />}
        </>
    );
};

export default DosenMahasiswaDashboard;