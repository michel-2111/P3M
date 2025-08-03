// src/components/modals/ProgramDetailModal.tsx
"use client";

import React from 'react';
import { FileText, Users, ThumbsUp, Clock, Check, Layers, Award, Info, ListChecks, Target as TargetIcon } from 'lucide-react';
import { Proposal, Program } from '@/types';
import Modal from '@/components/common/Modal';

const ProgramDetailModal = ({ program, onClose }: { program: Program, onClose: () => void }) => (
    <Modal onClose={onClose}>
        <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800">{program.namaProgram} ({program.id})</h2>
            <p className="text-md text-gray-500 mb-6 capitalize">{program.kategori}</p>
            <div className="space-y-6">
                <div>
                    <h3 className="detail-header"><Info className="w-5 h-5 mr-2"/>Deskripsi</h3>
                    <p className="text-gray-700">{program.deskripsi || "Deskripsi untuk program ini belum tersedia."}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 border rounded-lg">
                        <p className="text-sm font-semibold text-gray-600">Dana Maksimal</p>
                        <p className="text-xl font-bold text-blue-600">{program.detailLainnya.funding > 0 ? `Rp ${new Intl.NumberFormat('id-ID').format(program.detailLainnya.funding)}` : 'Dana Mandiri'}</p>
                    </div>
                    <div className="bg-white p-4 border rounded-lg">
                        <p className="text-sm font-semibold text-gray-600">Target TKT</p>
                        <p className="text-xl font-bold text-blue-600">{program.detailLainnya.tkt}</p>
                    </div>
                </div>
                <div>
                    <h3 className="detail-header"><TargetIcon className="w-5 h-5 mr-2"/>Tujuan Program</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">{(program.detailLainnya.goals || []).map((goal: string, i: number) => <li key={i}>{goal}</li>)}</ul>
                </div>
                <div>
                    <h3 className="detail-header"><ListChecks className="w-5 h-5 mr-2"/>Luaran Wajib</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">{(program.detailLainnya.outputs || []).map((output: string, i: number) => <li key={i}>{output}</li>)}</ul>
                </div>
                <div>
                    <h3 className="detail-header"><Award className="w-5 h-5 mr-2"/>Kriteria Tim</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li><strong>Tim:</strong> Minimal {program.detailLainnya.criteria?.team?.min} orang, Maksimal {program.detailLainnya.criteria?.team?.max} orang (termasuk ketua).</li>
                        {program.detailLainnya.criteria?.students > 0 && <li><strong>Mahasiswa:</strong> Minimal {program.detailLainnya.criteria.students} orang.</li>}
                        {program.detailLainnya.criteria?.sintaScore !== 'N/A' && <li><strong>Skor SINTA Ketua:</strong> {program.detailLainnya.criteria.sintaScore}.</li>}
                    </ul>
                </div>
            </div>
            <div className="mt-8 pt-5 border-t text-right">
                <button onClick={onClose} className="btn-secondary">Tutup</button>
            </div>
        </div>
    </Modal>
);

export default ProgramDetailModal;
