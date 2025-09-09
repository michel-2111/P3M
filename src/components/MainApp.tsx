// src/components/MainApp.tsx
"use client";

import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { LogOut, Bell } from 'lucide-react';
import { AppState, FinalDecision, Notification, Proposal, Review, ReviewType} from '@/types';
import { ProfileModal } from "./modals/ProfileModal";
import * as Dialog from "@radix-ui/react-dialog";
import AdminDashboard from './dashboard/AdminDashboard';
import DosenMahasiswaDashboard from './dashboard/DosenMahasiswaDashboard';
import ApprovalTasks from './dashboard/ApprovalTasks';
import MyProposals from './dashboard/MyProposals';
import CompleteProposalModal from './modals/CompleteProposalModal';
import ProposalDetailModal from './modals/ProposalDetailModal';
import AssignReviewerModal from './modals/AssignReviewerModal';
import ReviewModal from './modals/ReviewModal';
import ReviewResultModal from './modals/ReviewResultModal';
import RevisionDetailModal from './modals/RevisionDetailModal';
import ProposalRevisionModal from './modals/ProposalRevisionModal';
import ReviewTasks from './dashboard/ReviewTasks';
import LogbookModal from './modals/LogbookModal';
import ConfirmModal from './modals/ConfirmModal';
import LogbookMonitoring from './dashboard/LogbookMonitoring';
import ProgressReportModal from './modals/ProgressReportModal';
import ProgressMonitoring from './dashboard/ProgressMonitoring';
import FinalReportMonitoring from './dashboard/FinalReportMonitoring';
import UserManager from './dashboard/UserManager';
import ScheduleManager from './dashboard/ScheduleManager';
import DocumentManager from './dashboard/DocumentManager';
import ProposalDetailManager from './dashboard/ProposalDetailManager';
import AssessmentCriteriaManager from './dashboard/AssessmentCriteriaManager';
import OutputReviewResultModal from './modals/OutputReviewResultModal';

const MainApp = ({ initialState }: { initialState: AppState }) => {
    const [appState, setAppState] = useState<AppState>(initialState);
    const { currentUser, users, programs, proposals, reviews, settings } = appState;
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showNotifications, setShowNotifications] = useState(false);
    const [completingProposal, setCompletingProposal] = useState<Proposal | null>(null);
    const [detailProposal, setDetailProposal] = useState<Proposal | null>(null);
    const [assigningProposal, setAssigningProposal] = useState<Proposal | null>(null);
    const [reviewingTask, setReviewingTask] = useState<{ review: Review, proposal: Proposal } | null>(null);
    const [viewingResults, setViewingResults] = useState<Proposal | null>(null);
    const [revisingProposal, setRevisingProposal] = useState<Proposal | null>(null);
    const [viewingRevision, setViewingRevision] = useState<Proposal | null>(null);
    const [logbookProposal, setLogbookProposal] = useState<Proposal | null>(null);
    const [isLogbookReadOnly, setIsLogbookReadOnly] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
    const [progressReportProposal, setProgressReportProposal] = useState<Proposal | null>(null);
    const [isProgressReportReadOnly, setIsProgressReportReadOnly] = useState(false);
    const [assigningTask, setAssigningTask] = useState<{ proposal: Proposal, type: 'SUBSTANCE' | 'OUTPUT_KEMAJUAN' | 'OUTPUT_AKHIR' } | null>(null);
    const [finalReportProposal, setFinalReportProposal] = useState<Proposal | null>(null);
    const [viewingOutputResults, setViewingOutputResults] = useState<{ proposal: Proposal, type: 'OUTPUT_KEMAJUAN' | 'OUTPUT_AKHIR' } | null>(null);


    const handleLogout = () => signOut();

    const refreshData = async () => {
        try {
            const response = await fetch('/api/main', { cache: 'no-store' });
            if (response.ok) {
                const data = await response.json();
                setAppState(data);
            } else {
                toast.error("Gagal memuat data terbaru dari server.");
            }
        } catch (error) {
            console.error("Gagal memuat ulang data:", error);
            toast.error("Terjadi kesalahan jaringan saat memuat data.");
        }
    };

    const handleProposalSubmit = async (data: any) => {
        const toastId = toast.loading('Mengajukan proposal...');
        try {
            const response = await fetch('/api/proposals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success('Proposal berhasil diajukan & menunggu persetujuan judul!', { id: toastId });
                await refreshData();
                setActiveTab('my_proposals'); 
            } else {
                const errorData = await response.json();
                toast.error(`Gagal: ${errorData.message}`, { id: toastId });
            }
        } catch (error) {
            console.error('Error saat mengajukan proposal:', error);
            toast.error('Terjadi kesalahan pada jaringan.', { id: toastId });
        }
    };

    const handleApprove = async (proposalId: number) => {
        const toastId = toast.loading('Menyetujui undangan...');
        try {
            const response = await fetch(`/api/proposals/${proposalId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'approve_member' }),
            });
            if (response.ok) {
                toast.success('Undangan berhasil disetujui!', { id: toastId });
                await refreshData();
            } else {
                toast.error('Gagal menyetujui undangan.', { id: toastId });
            }
        } catch (error) {
            toast.error('Terjadi kesalahan jaringan.', { id: toastId });
        }
    };
    
    const handleTitleDecision = async (proposalId: number, decision: 'approve' | 'reject') => {
        const toastId = toast.loading(`Memproses persetujuan judul...`);
        try {
            const response = await fetch(`/api/proposals/${proposalId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: decision === 'approve' ? 'approve_title' : 'reject_title' }),
            });
            if (response.ok) {
                toast.success(`Judul proposal berhasil di-${decision === 'approve' ? 'setujui' : 'tolak'}.`, { id: toastId });
                await refreshData();
            } else {
                toast.error('Gagal memproses keputusan.', { id: toastId });
            }
        } catch (error) {
            toast.error('Terjadi kesalahan jaringan.', { id: toastId });
        }
    };

    const handleCompleteProposal = async (proposalId: number, data: any) => {
        const toastId = toast.loading('Mengirim proposal lengkap...');
        try {
            const response = await fetch(`/api/proposals/${proposalId}/complete`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success('Proposal berhasil diajukan untuk direview!', { id: toastId });
                setCompletingProposal(null);
                await refreshData();
            } else {
                toast.error('Gagal mengirim proposal.', { id: toastId });
            }
        } catch (error) {
            toast.error('Terjadi kesalahan jaringan.', { id: toastId });
        }
    };

    const handleAssignReviewers = async (
    proposalId: number,
    reviewerIds: string[],
    type: ReviewType
) => {
    const toastId = toast.loading('Menugaskan reviewer...');
    try {
        const response = await fetch(`/api/proposals/${proposalId}/assign-reviewers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reviewerIds, type }),
        });

        if (response.ok) {
            toast.success('Reviewer berhasil ditugaskan!', { id: toastId });
            setAssigningTask(null);
            await refreshData();
        } else {
            const errorData = await response.json();
            toast.error(`Gagal: ${errorData.message}`, { id: toastId });
        }
    } catch (error) {
        toast.error('Terjadi kesalahan jaringan.', { id: toastId });
    }
};

    const handleReviewSubmit = async (reviewId: number, data: any) => {
        const toastId = toast.loading('Mengirim penilaian...');
        try {
            const response = await fetch(`/api/reviews/${reviewId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                toast.success('Penilaian berhasil dikirim!', { id: toastId });
                setReviewingTask(null);
                await refreshData();
            } else {
                toast.error('Gagal mengirim penilaian.', { id: toastId });
            }
        } catch (error) {
            toast.error('Terjadi kesalahan jaringan.', { id: toastId });
        }
    };

    const handleFinalDecision = async (proposalId: number, decision: FinalDecision, reviewNotes: string[]) => {
        const toastId = toast.loading('Menyimpan keputusan akhir...');
        try {
            const response = await fetch(`/api/proposals/${proposalId}/final-decision`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ decision, reviewNotes }),
            });
            if (response.ok) {
                toast.success('Keputusan berhasil disimpan!', { id: toastId });
                setViewingResults(null);
                setViewingRevision(null);
                await refreshData();
            } else {
                toast.error('Gagal menyimpan keputusan.', { id: toastId });
            }
        } catch (error) {
            toast.error('Terjadi kesalahan jaringan.', { id: toastId });
        }
    };

    const handleResubmit = async (proposalId: number, data: any) => {
        const toastId = toast.loading('Mengirim perbaikan...');
        try {
            const response = await fetch(`/api/proposals/${proposalId}/resubmit`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                toast.success('Perbaikan berhasil dikirim!', { id: toastId });
                setRevisingProposal(null);
                await refreshData();
            } else {
                toast.error('Gagal mengirim perbaikan.', { id: toastId });
            }
        } catch (error) {
            toast.error('Terjadi kesalahan jaringan.', { id: toastId });
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.sudahDibaca) {
            await fetch(`/api/notifications/${notification.id}`, {
                method: 'PATCH',
            });
        }
        setActiveTab(notification.link.replace('/', ''));
        setShowNotifications(false);
        await refreshData();
    };

    const handleAddLogbook = async (proposalId: number, newLogEntryData: any) => {
        const toastId = toast.loading('Menambahkan entri logbook...');
        try {
            const response = await fetch(`/api/proposals/${proposalId}/logbook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newLogEntryData),
            });
            if (response.ok) {
                const newEntry = await response.json();
                toast.success('Entri logbook berhasil ditambahkan!', { id: toastId });

                const updatedProposals = appState.proposals.map(p => 
                    p.id === proposalId ? { ...p, logbookEntries: [...p.logbookEntries, newEntry] } : p
                );
                setAppState(prev => ({ ...prev, proposals: updatedProposals }));
                setLogbookProposal(prev => prev ? { ...prev, logbookEntries: [...prev.logbookEntries, newEntry] } : null);
            } else {
                toast.error('Gagal menambahkan entri.', { id: toastId });
            }
        } catch (error) {
            toast.error('Terjadi kesalahan jaringan.', { id: toastId });
        }
    };

    const handleEditLogbook = async (logId: number, updatedLogEntryData: any) => {
        const toastId = toast.loading('Memperbarui entri logbook...');
        try {
            const response = await fetch(`/api/logbook/${logId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedLogEntryData),
            });
            if (response.ok) {
                const updatedEntry = await response.json();
                toast.success('Entri berhasil diperbarui!', { id: toastId });

                const updatedProposals = appState.proposals.map(p => {
                    if (p.id === updatedEntry.proposalId) {
                        return {
                            ...p,
                            logbookEntries: p.logbookEntries.map(log => log.id === logId ? updatedEntry : log)
                        };
                    }
                    return p;
                });
                setAppState(prev => ({ ...prev, proposals: updatedProposals }));
                setLogbookProposal(prev => prev ? {
                    ...prev,
                    logbookEntries: prev.logbookEntries.map(log => log.id === logId ? updatedEntry : log)
                } : null);
            } else {
                toast.error('Gagal memperbarui entri.', { id: toastId });
            }
        } catch (error) {
            toast.error('Terjadi kesalahan jaringan.', { id: toastId });
        }
    };

    const handleDeleteLogbook = (logId: number) => {
        setDeleteConfirmation(logId);
    };

    const executeDeleteLogbook = async () => {
        if (deleteConfirmation === null) return;

        const logId = deleteConfirmation;
        setDeleteConfirmation(null);
        
        const toastId = toast.loading('Menghapus entri logbook...');
        try {
            const response = await fetch(`/api/logbook/${logId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                toast.success('Entri berhasil dihapus!', { id: toastId });
                
                const updatedProposals = appState.proposals.map(p => ({
                    ...p,
                    logbookEntries: p.logbookEntries.filter(log => log.id !== logId)
                }));
                setAppState(prev => ({ ...prev, proposals: updatedProposals }));
                setLogbookProposal(prev => prev ? {
                    ...prev,
                    logbookEntries: prev.logbookEntries.filter(log => log.id !== logId)
                } : null);
            } else {
                toast.error('Gagal menghapus entri.', { id: toastId });
            }
        } catch (error) {
            toast.error('Terjadi kesalahan jaringan.', { id: toastId });
        }
    };

    const handleViewLogbook = (proposal: Proposal) => {
        setIsLogbookReadOnly(true);
        setLogbookProposal(proposal);
    };

    const handleMyLogbook = (proposal: Proposal) => {
        setIsLogbookReadOnly(false);
        setLogbookProposal(proposal);
    };

    const handleViewProgress = (proposal: Proposal) => {
        setIsProgressReportReadOnly(true);
        setProgressReportProposal(proposal);
    };

    const handleMyProgress = (proposal: Proposal) => {
        setIsProgressReportReadOnly(false);
        setProgressReportProposal(proposal);
    };
    
    const handleProgressReportSubmit = async (proposalId: number, data: any) => {
        const toastId = toast.loading('Menyimpan laporan kemajuan...');
        try {
            await fetch(`/api/proposals/${proposalId}/progress`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            
            await fetch(`/api/proposals/${proposalId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'submit_progress_report' }),
            });

            toast.success('Laporan kemajuan berhasil disimpan!', { id: toastId });
            setProgressReportProposal(null);
            await refreshData();
        } catch (error) {
            toast.error('Gagal menyimpan laporan.', { id: toastId });
        }
    };

const handleFinalReportSubmit = async (proposalId: number, data: any) => {
    const toastId = toast.loading('Mengirim Laporan Akhir...');
    try {
        await fetch(`/api/proposals/${proposalId}/final-report`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        
        await fetch(`/api/proposals/${proposalId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'submit_final_report' }),
        });

        toast.success('Laporan Akhir berhasil dikirim untuk direview!', { id: toastId });
        setFinalReportProposal(null);
        await refreshData();
    } catch (error) {
        toast.error('Gagal mengirim Laporan Akhir.', { id: toastId });
    }
};

    const handleOutputDecision = async (proposalId: number, decision: 'Lengkap' | 'Tidak Lengkap', type: 'OUTPUT_KEMAJUAN' | 'OUTPUT_AKHIR') => {
        const toastId = toast.loading('Menyimpan keputusan...');
        try {
            const response = await fetch(`/api/proposals/${proposalId}/output-decision`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ decision, type }),
            });
            if (response.ok) {
                toast.success('Keputusan berhasil disimpan!', { id: toastId });
                setViewingOutputResults(null);
                await refreshData();
            } else { throw new Error("Gagal menyimpan keputusan"); }
        } catch (error: any) {
            toast.error(error.message, { id: toastId });
        }
    };

    const unreadCount = appState.currentUser.notifications?.filter(n => !n.sudahDibaca).length ?? 0;

    const renderContentByTab = () => {
        console.log("Mencoba merender tab:", activeTab);
        if (!currentUser?.peran) return <div>Memuat data pengguna...</div>;

        switch (activeTab) {
            case 'dashboard':
                if (currentUser.peran.includes('admin_p3m')) {
                    return <AdminDashboard 
                                proposals={proposals} 
                                reviews={reviews}
                                onTitleDecision={handleTitleDecision} 
                                onDetailClick={setDetailProposal}
                                onAssignReviewersClick={(proposal, type) => {
                                    let mappedType: 'SUBSTANCE' | 'OUTPUT_KEMAJUAN' | 'OUTPUT_AKHIR' = type === 'OUTPUT' ? 'OUTPUT_KEMAJUAN' : type;
                                    setAssigningTask({ proposal, type: mappedType });
                                }}
                                onViewResultsClick={setViewingResults}
                                onViewRevisionClick={setViewingRevision}
                            />;
                }
                return (
                    <div className="space-y-6">
                        <ApprovalTasks proposals={proposals} currentUser={currentUser} onApprove={handleApprove} />
                        <DosenMahasiswaDashboard programs={programs} currentUser={currentUser} users={users} proposals={proposals} onSubmitProposal={handleProposalSubmit} schedules={settings.schedules}/>
                    </div>
                );
            case 'my_proposals':
                return <MyProposals 
                            proposals={proposals} 
                            currentUser={currentUser} 
                            onCompleteClick={setCompletingProposal} 
                            onDetailClick={setDetailProposal}
                            onReviseClick={setRevisingProposal}
                            onLogbookClick={setLogbookProposal}
                            onProgressClick={handleMyProgress}
                            onFinalReportClick={setFinalReportProposal}
                            schedules={settings.schedules}
                        />;
            break;
            case 'user_management':
                if (currentUser.peran.includes('admin_p3m')) {
                    return <UserManager users={users} refreshData={refreshData} />;
                }
                break;
            case 'schedule_settings':
                if (currentUser.peran.includes('admin_p3m')) {
                    return <ScheduleManager schedules={settings.schedules} refreshData={refreshData} />;
                }
                break;
            case 'document_settings':
                if (currentUser.peran.includes('admin_p3m')) {
                    return <DocumentManager documentSettings={settings.document_settings} refreshData={refreshData} />;
                }
                break;
            case 'proposal_detail_settings':
                if (currentUser.peran.includes('admin_p3m')) {
                    return <ProposalDetailManager proposalDetailSettings={settings.proposal_details} refreshData={refreshData} />;
                }
                break;
            case 'assessment_criteria_settings':
                if (currentUser.peran.includes('admin_p3m')) {
                    return <AssessmentCriteriaManager assessmentCriteria={settings.assessment_criteria} refreshData={refreshData} />;
                }
                break;
            case 'review_tasks':
                return <ReviewTasks reviews={reviews} proposals={proposals} currentUser={currentUser} schedules={settings.schedules} onReviewClick={(review, proposal) => setReviewingTask({ review, proposal })} />;
            case 'logbook_monitoring':
                if (currentUser.peran.includes('admin_p3m')) {
                    return <LogbookMonitoring proposals={proposals} users={users} onViewLogbook={handleViewLogbook} />;
                }
                break;
            case 'progress_monitoring':
                if (currentUser.peran.includes('admin_p3m')) {
                    return <ProgressMonitoring 
                                proposals={proposals}
                                reviews={reviews}
                                onViewProgress={handleViewProgress}
                                onAssignReviewers={(proposal) => setAssigningTask({ proposal, type: 'OUTPUT_KEMAJUAN' })}
                                onViewOutputResults={(proposal) => setViewingOutputResults({ proposal, type: 'OUTPUT_KEMAJUAN' })}
                            />;
                }break;
            case 'final_report_monitoring':
                if (currentUser.peran.includes('admin_p3m')) { 
                    return <FinalReportMonitoring 
                        proposals={proposals}
                        reviews={reviews}
                        onAssignReviewers={(p) => setAssigningTask({ proposal: p, type: 'OUTPUT_AKHIR' })}
                        onViewOutputResults={(p) => setViewingOutputResults({ proposal: p, type: 'OUTPUT_AKHIR' })}
                    />;
                }break;
            default:
                console.log("Masuk case: 'default', mengalihkan ke dasbor.");
                setActiveTab('dashboard');
                return null;
        }
        console.log("Keluar dari switch tanpa merender komponen.");
    };

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <style jsx global>{`
                .btn-primary { background-color: #2563eb; color: white; padding: 8px 12px; border-radius: 6px; font-weight: 600; transition: background-color 0.2s; cursor: pointer; border: none; }
                .btn-primary:hover { background-color: #1d4ed8; }
                .btn-primary:disabled { background-color: #9ca3af; cursor: not-allowed; }
                .btn-secondary { background-color: #e5e7eb; color: #374151; padding: 8px 12px; border-radius: 6px; font-weight: 600; transition: background-color 0.2s; cursor: pointer; border: none;}
                .btn-secondary:hover { background-color: #d1d5db; }
                .input-field { width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; }
                .detail-header { display: flex; align-items: center; font-size: 1.125rem; font-weight: 700; color: #374151; margin-bottom: 0.5rem; }
                @keyframes fade-in-down { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; }
            `}</style>
            <header className="bg-white shadow-md sticky top-0 z-40">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <img src="https://i.imgur.com/kYImLzJ.png" alt="Logo Polimdo" className="h-10 mr-4" />
                        <h1 className="text-xl font-bold text-gray-800 hidden md:block">Sistem Manajemen PKM</h1>
                    </div>
                    <div className="flex items-center space-x-4 relative">
                        <button onClick={() => setShowNotifications(s => !s)} className="relative text-gray-600 hover:text-blue-600">
                            <Bell className="w-6 h-6"/>
                            {unreadCount > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        {showNotifications && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
                                <div className="p-3 border-b font-semibold text-sm text-gray-800">Notifikasi</div>
                                <div className="max-h-96 overflow-y-auto">
                                    {currentUser.notifications?.length > 0 ? (
                                        [...currentUser.notifications].reverse().map(n => (
                                            <div key={n.id} onClick={() => handleNotificationClick(n)} className={`p-3 text-sm border-b hover:bg-gray-100 cursor-pointer ${!n.sudahDibaca ? 'bg-blue-50' : ''}`}>
                                                <p className="text-gray-800">{n.pesan}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="p-4 text-sm text-gray-600">Tidak ada notifikasi.</p>
                                    )}
                                </div>
                            </div>
                        )}
                        <Dialog.Root>
                            <Dialog.Trigger asChild>
                                <button className="font-semibold text-sm text-gray-800 hover:text-blue-600 focus:outline-none cursor-pointer">
                                    {currentUser.namaLengkap}
                                </button>
                            </Dialog.Trigger>
                            <ProfileModal />
                        </Dialog.Root>
                        <button onClick={handleLogout} className="flex items-center text-sm text-red-500 hover:text-red-700 font-semibold">
                            <LogOut className="w-4 h-4 mr-1" />Logout
                        </button>
                    </div>
                </div>
                <nav className="bg-blue-800 text-white">
                    <div className="container mx-auto px-4 flex items-center space-x-6 overflow-x-auto">
                        <button className={`py-3 px-2 font-semibold ${activeTab === 'dashboard' ? 'border-b-4 border-yellow-400' : ''}`} onClick={() => setActiveTab('dashboard')}>Dasbor</button>
                        {currentUser.peran && !currentUser.peran.includes('admin_p3m') && (
                            <button className={`py-3 px-2 font-semibold ${activeTab === 'my_proposals' ? 'border-b-4 border-yellow-400' : ''}`} onClick={() => setActiveTab('my_proposals')}>Proposal Saya</button>
                        )}
                        {currentUser.peran && currentUser.peran.includes('admin_p3m') && (
                            <button className={`py-3 px-2 font-semibold ${activeTab === 'user_management' ? 'border-b-4 border-yellow-400' : ''}`} onClick={() => setActiveTab('user_management')}>User Manager</button>
                        )}
                        {currentUser.peran && currentUser.peran.includes('admin_p3m') && (
                            <button className={`py-3 px-2 font-semibold ${activeTab === 'schedule_settings' ? 'border-b-4 border-yellow-400' : ''}`} onClick={() => setActiveTab('schedule_settings')}>Jadwal</button>
                        )}
                        {currentUser.peran && currentUser.peran.includes('admin_p3m') && (
                            <button className={`py-3 px-2 font-semibold ${activeTab === 'document_settings' ? 'border-b-4 border-yellow-400' : ''}`} onClick={() => setActiveTab('document_settings')}>Dokumen</button>
                        )}
                        {currentUser.peran && currentUser.peran.includes('admin_p3m') && (
                            <button className={`py-3 px-2 font-semibold ${activeTab === 'proposal_detail_settings' ? 'border-b-4 border-yellow-400' : ''}`} onClick={() => setActiveTab('proposal_detail_settings')}>Detail Proposal</button>
                        )}
                        {currentUser.peran && currentUser.peran.includes('admin_p3m') && (
                            <button className={`py-3 px-2 font-semibold ${activeTab === 'assessment_criteria_settings' ? 'border-b-4 border-yellow-400' : ''}`} onClick={() => setActiveTab('assessment_criteria_settings')}>Kriteria Penilaian</button>
                        )}
                        {currentUser.peran && (currentUser.peran.includes('reviewer_penelitian') || currentUser.peran.includes('reviewer_pengabdian')) && (
                            <button className={`py-3 px-2 font-semibold ${activeTab === 'review_tasks' ? 'border-b-4 border-yellow-400' : ''}`} onClick={() => setActiveTab('review_tasks')}>Tugas Review</button>
                        )}
                        {currentUser.peran && currentUser.peran.includes('admin_p3m') && (
                            <button className={`py-3 px-2 font-semibold ${activeTab === 'logbook_monitoring' ? 'border-b-4 border-yellow-400' : ''}`} onClick={() => setActiveTab('logbook_monitoring')}>Logbook</button>
                        )}
                        {currentUser.peran && currentUser.peran.includes('admin_p3m') && (
                            <button className={`py-3 px-2 font-semibold ${activeTab === 'progress_monitoring' ? 'border-b-4 border-yellow-400' : ''}`} onClick={() => setActiveTab('progress_monitoring')}>Laporan Kemajuan</button>
                        )}
                        {currentUser.peran && currentUser.peran.includes('admin_p3m') && (
                            <button className={`py-3 px-2 font-semibold ${activeTab === 'final_report_monitoring' ? 'border-b-4 border-yellow-400' : ''}`} onClick={() => setActiveTab('final_report_monitoring')}>Laporan Akhir</button>
                        )}
                    </div>
                </nav>
            </header>
            
            <main className="container mx-auto p-4 md-p-6">
                {renderContentByTab()}
            </main>

            {completingProposal && (
                <CompleteProposalModal 
                    proposal={completingProposal}
                    settings={settings}
                    onClose={() => setCompletingProposal(null)}
                    onSubmit={handleCompleteProposal}
                />
            )}
            {detailProposal && (
                <ProposalDetailModal
                    proposal={detailProposal}
                    onClose={() => setDetailProposal(null)}
                />
            )}
            {assigningTask && (
                <AssignReviewerModal
                    proposal={assigningTask.proposal}
                    users={users}
                    type={assigningTask.type}
                    onClose={() => setAssigningTask(null)}
                    onAssign={handleAssignReviewers}
                />
            )}
            {reviewingTask && (
                <ReviewModal
                    review={reviewingTask.review}
                    proposal={reviewingTask.proposal}
                    assessmentCriteria={settings.assessment_criteria}
                    onClose={() => setReviewingTask(null)}
                    onSubmit={handleReviewSubmit}
                    />
            )}
            {viewingResults && (
                <ReviewResultModal
                    proposal={viewingResults}
                    reviews={reviews}
                    users={users}
                    onClose={() => setViewingResults(null)}
                    onDecision={handleFinalDecision}
                />
            )}
            {revisingProposal && (
                <ProposalRevisionModal
                    proposal={revisingProposal}
                    reviews={reviews}
                    users={users}
                    settings={settings}
                    onClose={() => setRevisingProposal(null)}
                    onSubmit={handleResubmit}
                />
            )}
            {viewingRevision && (
                <RevisionDetailModal
                    proposal={viewingRevision}
                    settings={settings}
                    onClose={() => setViewingRevision(null)}
                    onDecision={handleFinalDecision}
                />
            )}
            {logbookProposal && (
                <LogbookModal
                    proposal={logbookProposal}
                    onClose={() => setLogbookProposal(null)}
                    onAddLogbook={handleAddLogbook}
                    onEditLogbook={handleEditLogbook}
                    onDeleteLogbook={handleDeleteLogbook}
                    isReadOnly={isLogbookReadOnly}
                />
            )}
            {deleteConfirmation !== null && (
                <ConfirmModal
                    title="Hapus Entri Logbook"
                    message="Apakah Anda yakin ingin menghapus entri ini secara permanen? Aksi ini tidak dapat dibatalkan."
                    onConfirm={executeDeleteLogbook}
                    onCancel={() => setDeleteConfirmation(null)}
                />
            )}
            {progressReportProposal && (
                <ProgressReportModal
                    proposal={progressReportProposal}
                    onClose={() => setProgressReportProposal(null)}
                    onSubmit={handleProgressReportSubmit}
                    isReadOnly={isProgressReportReadOnly}
                />
            )}
            {finalReportProposal && (
                <ProgressReportModal
                    proposal={finalReportProposal}
                    onClose={() => setFinalReportProposal(null)}
                    onSubmit={handleFinalReportSubmit}
                    isFinalReport={true}
                />
            )}
            {viewingOutputResults && (
                <OutputReviewResultModal
                    proposal={viewingOutputResults.proposal}
                    reviews={reviews.filter(r => r.proposalId === viewingOutputResults.proposal.id && r.type === viewingOutputResults.type)}
                    users={users}
                    type={viewingOutputResults.type}
                    onClose={() => setViewingOutputResults(null)}
                    onDecision={handleOutputDecision}
                />
            )}
        </div>
    );
};

export default MainApp;