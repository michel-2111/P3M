// src/components/dashboard/ReviewTasks.tsx
"use client";

import { Proposal, Review, Setting, User as UserType } from "@/types";
import { CheckCircle, Clock, Edit, FileText, Star, BookOpen } from "lucide-react";
import React from "react";
import PeriodBanner from "../common/PeriodBanner";

interface ReviewTasksProps {
    reviews: Review[];
    proposals: Proposal[];
    currentUser: UserType;
    schedules: Setting['schedules'];
    onReviewClick: (review: Review, proposal: Proposal) => void;
}

const ReviewTable = ({ 
    title,
    tasks,
    proposals,
    schedules,
    onReviewClick,
    Icon 
}: { 
    title: string, 
    tasks: Review[], 
    proposals: Proposal[], 
    schedules: Setting['schedules'],
    onReviewClick: (review: Review, proposal: Proposal) => void,
    Icon: React.ElementType 
}) => {
    if (tasks.length === 0) {
        return null;
    }

    const getPeriodStatus = (period: { start: string, end: string } | undefined) => {
        if (!period?.start || !period?.end) return 'open';

        const today = new Date();
        const startDate = new Date(period.start);
        const endDate = new Date(period.end);
        endDate.setHours(23, 59, 59, 999);

        if (today < startDate) return 'upcoming';
        if (today > endDate) return 'closed';
        return 'open';
    };
    
    const taskType = tasks[0]?.type;
    let relevantPeriod;
    if (taskType === 'SUBSTANCE') relevantPeriod = schedules.substanceReviewPeriod;
    if (taskType === 'OUTPUT_KEMAJUAN') relevantPeriod = schedules.progressReviewPeriod;
    if (taskType === 'OUTPUT_AKHIR') relevantPeriod = schedules.finalReviewPeriod;

    const periodStatus = getPeriodStatus(relevantPeriod);

    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Icon className="w-6 h-6 mr-3 text-blue-600"/>
                {title}
            </h3>
            
            <PeriodBanner 
                period={relevantPeriod!}
                periodStatus={periodStatus}
                openText={`Periode ${title} Sedang Berlangsung`}
                closedText={`Periode ${title} Telah Ditutup`}
                upcomingText={`Periode ${title} Akan Datang`}
            />

            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Proposal</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ketua Tim</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tasks.map(task => {
                            const proposal = proposals.find(p => p.id === task.proposalId);
                            if (!proposal) return null;

                            const isCompleted = !!task.rekomendasi;
                            const isReviewPeriodOpen = periodStatus === 'open';
                            
                            return (
                                <tr key={task.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{proposal.judul}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{proposal.ketua.namaLengkap}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {isCompleted
                                            ? <span className="flex items-center text-green-600 font-semibold"><CheckCircle className="w-4 h-4 mr-1"/> Selesai</span> 
                                            : <span className="flex items-center text-yellow-600 font-semibold"><Clock className="w-4 h-4 mr-1"/> Menunggu</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {isCompleted ? (
                                            <button 
                                                onClick={() => onReviewClick(task, proposal)}
                                                disabled={!isReviewPeriodOpen}
                                                className="btn-secondary text-xs flex items-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                title={isReviewPeriodOpen ? "Edit Penilaian" : "Periode review telah ditutup."}
                                            >
                                                <Edit size={14} className="mr-1" />
                                                Edit Penilaian
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => onReviewClick(task, proposal)} 
                                                className="btn-primary text-xs flex items-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                disabled={!isReviewPeriodOpen}
                                                title={isReviewPeriodOpen ? "Buka formulir penilaian" : "Periode review telah ditutup."}
                                            >
                                                <Edit size={14} className="mr-1" />
                                                Lihat & Nilai
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ... Komponen ReviewTasks (wrapper) tetap sama ...
const ReviewTasks = ({ reviews, proposals, currentUser, schedules, onReviewClick }: ReviewTasksProps) => {
    const myTasks = reviews.filter(r => r.reviewerId === currentUser.id);
    
    const substanceTasks = myTasks.filter(task => task.type === 'SUBSTANCE');
    const progressReportTasks = myTasks.filter(task => task.type === 'OUTPUT_KEMAJUAN');
    const finalReportTasks = myTasks.filter(task => task.type === 'OUTPUT_AKHIR');

    const totalTasks = myTasks.length;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tugas Review Saya ({totalTasks})</h2>
            
            {totalTasks > 0 ? (
                <>
                    <ReviewTable 
                        title="Tugas Review Substansi Proposal"
                        tasks={substanceTasks}
                        proposals={proposals}
                        schedules={schedules}
                        onReviewClick={onReviewClick}
                        Icon={FileText}
                    />
                    <ReviewTable 
                        title="Tugas Review Laporan Kemajuan"
                        tasks={progressReportTasks}
                        proposals={proposals}
                        schedules={schedules}
                        onReviewClick={onReviewClick}
                        Icon={BookOpen}
                    />
                    <ReviewTable 
                        title="Tugas Review Laporan Akhir"
                        tasks={finalReportTasks}
                        proposals={proposals}
                        schedules={schedules}
                        onReviewClick={onReviewClick}
                        Icon={Star}
                    />
                </>
            ) : (
                <div className="text-center py-10 text-gray-500">
                    <p>Tidak ada tugas review untuk Anda saat ini.</p>
                </div>
            )}
        </div>
    );
};

export default ReviewTasks;