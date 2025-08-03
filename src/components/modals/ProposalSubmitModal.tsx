// src/components/modals/ProposalSubmitModal.tsx
"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Program, User as UserType } from '@/types';
import Modal from '@/components/common/Modal';
import { Search } from 'lucide-react';

const ProposalSubmitModal = ({ program, users, currentUser, onClose, onSubmit }: { program: Program, users: UserType[], currentUser: UserType, onClose: () => void, onSubmit: (data: any) => void }) => {
    const [title, setTitle] = useState('');
    const [abstract, setAbstract] = useState('');
    const [tkt, setTkt] = useState('');
    const [team, setTeam] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const minTeamSize = (program.detailLainnya.criteria.team.min ?? 2) - 1;
    const maxTeamSize = (program.detailLainnya.criteria.team.max ?? 5) - 1;
    const requiredStudents = program.detailLainnya.criteria?.students ?? 0;
    
    const isTktRequired = program.detailLainnya.tkt !== 'N/A';
    let minTkt: number | undefined, maxTkt: number | undefined;
    if (isTktRequired) {
        [minTkt, maxTkt] = program.detailLainnya.tkt.split('-').map(Number);
    }

    const potentialMembers = users.filter(u => u.id !== currentUser.id && !u.peran.includes('admin_p3m'));

    const handleTeamChange = (userId: string) => {
        setTeam(prev => {
            if (prev.includes(userId)) return prev.filter(id => id !== userId);
            if (prev.length < maxTeamSize) return [...prev, userId];
            toast.error(`Anda hanya dapat memilih maksimal ${maxTeamSize} anggota.`);
            return prev;
        });
    };

    const selectedTeamMembers = users.filter(user => team.includes(user.id));
    const studentCount = selectedTeamMembers.filter(member => member.peran.includes('mahasiswa')).length;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (team.length < minTeamSize) {
            toast.error(`Anda harus memilih minimal ${minTeamSize} total anggota tim.`);
            return;
        }
        
        if (requiredStudents > 0 && studentCount < requiredStudents) {
            toast.error(`Anda harus memilih minimal ${requiredStudents} anggota mahasiswa.`);
            return;
        }

        if (isTktRequired) {
            const tktValue = parseInt(tkt, 10);
            if (isNaN(tktValue) || (minTkt && tktValue < minTkt) || (maxTkt && tktValue > maxTkt)) {
                toast.error(`TKT yang dimasukkan harus berada dalam rentang ${program.detailLainnya.tkt}.`);
                return;
            }
        }
        const newProposalData = {
            programId: program.id,
            judul: title,
            abstrak: abstract,
            anggotaIds: team,
            detailProposal: {
                tkt: isTktRequired ? parseInt(tkt, 10) : null,
                luaranTambahan: [],
            },
        };
        onSubmit(newProposalData);
        onClose();
    };

    const filteredMembers = potentialMembers.filter(member =>
        member.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Modal onClose={onClose} size="4xl">
            <form onSubmit={handleSubmit} className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Pengajuan Awal Proposal</h2>
                <p className="text-gray-600 mb-6">Skema: <span className="font-semibold text-blue-600">{program.namaProgram}</span></p>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Proposal</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 input-field text-gray-900" required />
                    </div>
                    <div>
                        <label htmlFor="abstract" className="block text-sm font-medium text-gray-700">Abstrak</label>
                        <textarea id="abstract" value={abstract} onChange={(e) => setAbstract(e.target.value)} className="mt-1 input-field text-gray-900" rows={4} required />
                    </div>
                    {isTktRequired && (
                        <div>
                            <label htmlFor="tkt" className="block text-sm font-medium text-gray-700">Tingkat Kesiapterapan Teknologi (TKT) Saat Ini</label>
                            <input type="number" id="tkt" value={tkt} onChange={(e) => setTkt(e.target.value)} className="mt-1 input-field w-40 text-gray-900" placeholder={`Contoh: ${minTkt}`} required min={minTkt} max={maxTkt} />
                            <p className="text-xs text-gray-500 mt-1">Rentang TKT yang diizinkan: <strong>{program.detailLainnya.tkt}</strong>.</p>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Anggota Tim ({team.length} dipilih, Min: {minTeamSize}, Max: {maxTeamSize})</label>
                        {requiredStudents > 0 && (
                            <p className="text-xs text-gray-500 -mt-2 mb-2">
                                Mahasiswa terpilih: <span className={studentCount < requiredStudents ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>{studentCount}</span> / {requiredStudents} (minimal)
                            </p>
                        )}
                        <div className="relative mb-2">
                            <input
                                type="text"
                                placeholder="Cari nama anggota..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field w-full pl-10 pr-3 py-2 text-gray-900"
                            />
                        </div>
                        <div className="bg-white p-4 border border-gray-300 rounded-md max-h-60 overflow-y-auto">
                            {filteredMembers.map(member => (
                                <div key={member.id} className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-semibold text-gray-800">{member.namaLengkap}</p>
                                        <p className="text-xs text-gray-500 capitalize">{member.peran.join(', ')}</p>
                                    </div>
                                    <input type="checkbox" checked={team.includes(member.id)} onChange={() => handleTeamChange(member.id)} disabled={!team.includes(member.id) && team.length >= maxTeamSize} className="h-5 w-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500 disabled:bg-gray-200"/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-5 border-t flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="btn-secondary">Batal</button>
                    <button type="submit" className="btn-primary">Ajukan untuk Persetujuan Judul</button>
                </div>
            </form>
        </Modal>
    );
};

export default ProposalSubmitModal;
