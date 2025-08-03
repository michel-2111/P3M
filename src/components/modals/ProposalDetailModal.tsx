// src/components/modals/ProposalDetailModal.tsx
"use client";

import React from 'react';
import { FileText, Users, ThumbsUp, Clock, Check, Layers, Award } from 'lucide-react';
import { Proposal } from '@/types';
import Modal from '@/components/common/Modal';

const StatusPersetujuan = ({ status }: { status: string }) => (
    status === 'Disetujui'
        ? <span className="flex items-center text-green-600 text-xs font-semibold"><ThumbsUp className="w-4 h-4 mr-1"/> Disetujui</span>
        : <span className="flex items-center text-yellow-600 text-xs font-semibold"><Clock className="w-4 h-4 mr-1"/> Menunggu</span>
);

const ProposalTimeline = ({ currentStatus }: { currentStatus: string }) => {
    const statusHistory = [
        { key: 'Menunggu Persetujuan Judul', label: 'Persetujuan Judul' },
        { key: 'Menunggu Persetujuan Anggota', label: 'Persetujuan Tim' },
        { key: 'Menunggu Kelengkapan Dokumen', label: 'Kelengkapan Dokumen' },
        { key: 'Diajukan', label: 'Pengajuan ke P3M' },
        { key: 'Direview', label: 'Review Substansi' },
        { key: 'Didanai', label: 'Pelaksanaan' },
        { key: 'Selesai', label: 'Selesai' }
    ];

    const currentStatusIndex = statusHistory.findIndex(s => s.key === currentStatus);

    return (
        <div className="my-8">
            <h3 className="detail-header"><Layers className="w-5 h-5 mr-2"/>Linimasa Proposal</h3>
            <ol className="relative border-l border-gray-200">                  
                {statusHistory.map((status, index) => {
                    const isCompleted = index < currentStatusIndex || currentStatus === 'Selesai';
                    const isCurrent = index === currentStatusIndex && currentStatus !== 'Selesai';
                    
                    return (
                        <li key={status.key} className="mb-10 ml-6">            
                            <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-300'}`}>
                                {isCompleted ? <Check className="w-4 h-4 text-white" /> : <Clock className="w-4 h-4 text-white" />}
                            </span>
                            <h4 className={`font-semibold ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>{status.label}</h4>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

const ProposalDetailModal = ({ proposal, onClose }: { proposal: Proposal, onClose: () => void }) => {
    return (
        <Modal onClose={onClose} size="4xl">
            <div className="p-8">
                {proposal.status === 'Selesai' && (
                    <div className="bg-purple-100 border-l-4 border-purple-500 text-purple-700 p-4 rounded-md mb-6" role="alert">
                        <div className="flex">
                            <div className="py-1"><Award className="h-6 w-6 text-purple-500 mr-4"/></div>
                            <div>
                                <p className="font-bold">Proposal Selesai</p>
                                <p className="text-sm">Selamat, seluruh rangkaian kegiatan untuk proposal ini telah selesai.</p>
                            </div>
                        </div>
                    </div>
                )}
                
                <h2 className="text-2xl font-bold text-gray-800">{proposal.judul}</h2>
                <p className="text-gray-500 text-sm mt-1">Skema: {proposal.program.namaProgram}</p>

                <ProposalTimeline currentStatus={proposal.status} />

                <div className="mt-6 space-y-6">
                    <div>
                        <h3 className="detail-header"><FileText className="w-5 h-5 mr-2"/>Abstrak</h3>
                        <p className="text-gray-700 bg-gray-100 p-3 rounded-md italic">"{proposal.abstrak}"</p>
                    </div>
                    
                    <div>
                        <h3 className="detail-header"><Users className="w-5 h-5 mr-2"/>Tim Proposal</h3>
                        <ul className="space-y-2">
                            <li className="flex justify-between items-center text-sm p-2 bg-gray-100 rounded-md">
                                {/* PERUBAHAN: Menambahkan text-gray-800 */}
                                <span className="font-medium text-gray-800">{proposal.ketua.namaLengkap}</span>
                                <span className="font-bold text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">KETUA</span>
                            </li>
                            {proposal.anggotaTim.map(a => (
                                <li key={a.user.id} className="flex justify-between items-center text-sm p-2 bg-gray-100 rounded-md">
                                    {/* PERUBAHAN: Menambahkan text-gray-800 */}
                                    <span className="font-medium text-gray-800">{a.user.namaLengkap}</span>
                                    <StatusPersetujuan status={a.statusPersetujuan} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-5 border-t text-right">
                    <button onClick={onClose} className="btn-secondary">Tutup</button>
                </div>
            </div>
        </Modal>
    );
};

export default ProposalDetailModal;
