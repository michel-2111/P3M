// src/components/dashboard/ScheduleManager.tsx
"use client";

import { Setting } from "@/types";
import { CalendarCog, Save } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface ScheduleManagerProps {
    schedules: Setting['schedules'];
    refreshData: () => Promise<void>;
}

const ScheduleManager = ({ schedules, refreshData }: ScheduleManagerProps) => {
    const [proposalStart, setProposalStart] = useState(schedules?.proposalPeriod?.start || '');
    const [proposalEnd, setProposalEnd] = useState(schedules?.proposalPeriod?.end || '');
    const [luaranStart, setLuaranStart] = useState(schedules?.luaranPeriod?.start || '');
    const [luaranEnd, setLuaranEnd] = useState(schedules?.luaranPeriod?.end || '');
    const [substanceReviewStart, setSubstanceReviewStart] = useState(schedules?.substanceReviewPeriod?.start || '');
    const [substanceReviewEnd, setSubstanceReviewEnd] = useState(schedules?.substanceReviewPeriod?.end || '');
    const [progressReviewStart, setProgressReviewStart] = useState(schedules?.progressReviewPeriod?.start || '');
    const [progressReviewEnd, setProgressReviewEnd] = useState(schedules?.progressReviewPeriod?.end || '');
    const [finalReviewStart, setFinalReviewStart] = useState(schedules?.finalReviewPeriod?.start || '');
    const [finalReviewEnd, setFinalReviewEnd] = useState(schedules?.finalReviewPeriod?.end || '');


    const handleSave = async () => {
        // Validasi client-side sederhana
        if ((proposalStart && proposalEnd && new Date(proposalStart) > new Date(proposalEnd)) ||
            (luaranStart && luaranEnd && new Date(luaranStart) > new Date(luaranEnd))) {
            toast.error("Tanggal mulai tidak boleh melebihi tanggal berakhir.");
            return;
        }

        const newSchedules = {
            proposalPeriod: { start: proposalStart, end: proposalEnd },
            luaranPeriod: { start: luaranStart, end: luaranEnd },
            substanceReviewPeriod: { start: substanceReviewStart, end: substanceReviewEnd },
            progressReviewPeriod: { start: progressReviewStart, end: progressReviewEnd },
            finalReviewPeriod: { start: finalReviewStart, end: finalReviewEnd },
        };

        const toastId = toast.loading('Menyimpan jadwal...');
        try {
            const response = await fetch('/api/settings/schedules', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSchedules),
            });

            if (response.ok) {
                toast.success('Jadwal berhasil disimpan!', { id: toastId });
                await refreshData();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Gagal menyimpan jadwal.');
            }
        } catch (error: any) {
            toast.error(error.message, { id: toastId });
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <CalendarCog className="w-6 h-6 mr-3 text-blue-600"/>
                    Pengaturan Jadwal Pengajuan Proposal
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="proposal-start-date" className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
                        <input type="date" id="proposal-start-date" value={proposalStart} onChange={e => setProposalStart(e.target.value)} className="mt-1 input-field text-gray-700" />
                    </div>
                    <div>
                        <label htmlFor="proposal-end-date" className="block text-sm font-medium text-gray-700">Tanggal Berakhir</label>
                        <input type="date" id="proposal-end-date" value={proposalEnd} onChange={e => setProposalEnd(e.target.value)} className="mt-1 input-field text-gray-700" />
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <CalendarCog className="w-6 h-6 mr-3 text-green-600"/>
                    Pengaturan Jadwal Pemasukan Luaran
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="luaran-start-date" className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
                        <input type="date" id="luaran-start-date" value={luaranStart} onChange={e => setLuaranStart(e.target.value)} className="mt-1 input-field text-gray-700" />
                    </div>
                    <div>
                        <label htmlFor="luaran-end-date" className="block text-sm font-medium text-gray-700">Tanggal Berakhir</label>
                        <input type="date" id="luaran-end-date" value={luaranEnd} onChange={e => setLuaranEnd(e.target.value)} className="mt-1 input-field text-gray-700" />
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <CalendarCog className="w-6 h-6 mr-3 text-purple-600"/>
                    Pengaturan Jadwal Periode Review
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                    <div>
                        <label htmlFor="substance-start-date" className="block text-sm font-medium text-gray-700">Mulai Review Substansi</label>
                        <input type="date" id="substance-start-date" value={substanceReviewStart} onChange={e => setSubstanceReviewStart(e.target.value)} className="mt-1 input-field text-gray-700" />
                    </div>
                    <div>
                        <label htmlFor="substance-end-date" className="block text-sm font-medium text-gray-700">Akhir Review Substansi</label>
                        <input type="date" id="substance-end-date" value={substanceReviewEnd} onChange={e => setSubstanceReviewEnd(e.target.value)} className="mt-1 input-field text-gray-700" />
                    </div>
                    <div>
                        <label htmlFor="progress-start-date" className="block text-sm font-medium text-gray-700">Mulai Review Laporan Kemajuan</label>
                        <input type="date" id="progress-start-date" value={progressReviewStart} onChange={e => setProgressReviewStart(e.target.value)} className="mt-1 input-field text-gray-700" />
                    </div>
                    <div>
                        <label htmlFor="progress-end-date" className="block text-sm font-medium text-gray-700">Akhir Review Laporan Kemajuan</label>
                        <input type="date" id="progress-end-date" value={progressReviewEnd} onChange={e => setProgressReviewEnd(e.target.value)} className="mt-1 input-field text-gray-700" />
                    </div>
                    <div>
                        <label htmlFor="final-start-date" className="block text-sm font-medium text-gray-700">Mulai Review Laporan Akhir</label>
                        <input type="date" id="final-start-date" value={finalReviewStart} onChange={e => setFinalReviewStart(e.target.value)} className="mt-1 input-field text-gray-700" />
                    </div>
                    <div>
                        <label htmlFor="final-end-date" className="block text-sm font-medium text-gray-700">Akhir Review Laporan Akhir</label>
                        <input type="date" id="final-end-date" value={finalReviewEnd} onChange={e => setFinalReviewEnd(e.target.value)} className="mt-1 input-field text-gray-700" />
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-5 border-t text-right">
                <button onClick={handleSave} className="btn-primary flex items-center ml-auto">
                    <Save className="w-4 h-4 mr-2"/>
                    Simpan Semua Jadwal
                </button>
            </div>
        </div>
    );
};

export default ScheduleManager;