// src/components/modals/ReviewModal.tsx
"use client";

import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Proposal, Review, ReviewType } from '@/types';
import Modal from '@/components/common/Modal';
import { ChevronDown, ChevronUp, Paperclip } from 'lucide-react';
import SubmittedOutputsViewer from '../common/SubmittedOutputsViewer';

interface ReviewModalProps {
    review: Review;
    proposal: Proposal;
    assessmentCriteria: any;
    onClose: () => void;
    onSubmit: (reviewId: number, data: any) => void;
}

const SubstanceDetails = ({ proposal }: { proposal: Proposal }) => {
    const DetailSection = ({ title, content }: { title: string, content: string | undefined }) => {
        if (!content) return null;
        return (
            <div className="mt-4">
                <h4 className="font-semibold text-gray-700">{title}</h4>
                <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-md mt-1 whitespace-pre-wrap">{content}</p>
            </div>
        );
    };

    return (
        <div className="mt-4 pt-4 border-t border-blue-200">
            <DetailSection title="Abstrak" content={proposal.abstrak} />
            <DetailSection title="Pendahuluan" content={proposal.detailProposal?.pendahuluan} />
            <DetailSection title="Metode Penelitian" content={proposal.detailProposal?.metode} />
            <DetailSection title="Hasil yang Diharapkan" content={proposal.detailProposal?.hasilDiharapkan} />
            <DetailSection title="Analisis Situasi & Permasalahan Mitra" content={proposal.detailProposal?.analisisSituasi} />
            <DetailSection title="Solusi Permasalahan" content={proposal.detailProposal?.solusiPermasalahan} />
            <DetailSection title="Daftar Pustaka" content={proposal.detailProposal?.referensi} />
            <div className="mt-4">
                <h4 className="font-semibold text-gray-700">Dokumen Terunggah</h4>
                <ul className="list-disc list-inside mt-1 space-y-1">
                    {Object.entries(proposal.dokumenDiunggah || {}).map(([key, value]) => (
                        <li key={key} className="text-sm">
                            <a href="#" className="text-blue-600 hover:underline">{value as string}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


const ReviewModal = ({ review, proposal, assessmentCriteria, onClose, onSubmit }: ReviewModalProps) => {
    const [scores, setScores] = useState(review.skor || {});
    const [catatan, setCatatan] = useState(review.catatan || '');
    const [rekomendasi, setRekomendasi] = useState(review.rekomendasi || '');
    const [showDetails, setShowDetails] = useState(false);

    const isOutputReview = review.type === 'OUTPUT_KEMAJUAN' || review.type === 'OUTPUT_AKHIR';

    const criteria = useMemo(() => {
        if (!assessmentCriteria) return null;
        
        switch (review.type) {
            case 'OUTPUT_KEMAJUAN':
                return assessmentCriteria.output_kemajuan;
            case 'OUTPUT_AKHIR':
                return assessmentCriteria.output_akhir;
            case 'SUBSTANCE':
                const program = proposal.program;
                return program.kategori === 'Penelitian'
                    ? assessmentCriteria.penelitian?.[program.id]
                    : assessmentCriteria.pengabdian?.[program.id];
            default:
                return null;
        }
    }, [review.type, proposal, assessmentCriteria]);

    const handleScoreChange = (groupKey: string, itemKey: string | null, score: number) => {
        if (proposal.program.kategori === 'Pengabdian' && !isOutputReview) {
            setScores((prev: any) => ({ ...prev, [groupKey]: score }));
        } else {
            setScores((prev: any) => ({
                ...prev,
                [groupKey]: {
                    ...(prev[groupKey] || {}),
                    [itemKey as string]: score,
                }
            }));
        }
    };

    const calculateScore = () => {
        if (!scores || !criteria) return 0;
        
        let totalScore = 0;
        if (criteria.groups) {
            criteria.groups.forEach((group: any) => {
                if (scores[group.name]) {
                    group.items.forEach((item: any) => {
                        const score = scores[group.name][item.key] || 0;
                        totalScore += score * item.weight;
                    });
                }
            });
        } else if (Array.isArray(criteria)) {
            criteria.forEach((section: any, sectionIndex: number) => {
                section.components.forEach((component: any, componentIndex: number) => {
                    const scoreKey = `${section.title}-${componentIndex}`;
                    const score = scores[scoreKey] || 0;
                    totalScore += score;
                });
            });
        }
        return totalScore;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rekomendasi) {
            toast.error('Harap pilih rekomendasi akhir.');
            return;
        }
        const totalSkor = calculateScore();
        onSubmit(review.id, { scores, totalSkor, catatan, rekomendasi });
    };

    const renderAssessmentForm = () => {
        if (!criteria) {
            return <p className="text-center text-gray-500 py-10">Kriteria penilaian untuk jenis review ini tidak tersedia.</p>;
        }

        if (proposal.program.kategori === 'Penelitian' || isOutputReview) { 
            return criteria.groups.map((group: any, groupIndex: number) => ( 
                <fieldset key={groupIndex} className="border p-4 rounded-lg"> 
                    <legend className="px-2 font-bold text-lg text-gray-800">{group.name} (Bobot: {group.weight}%)</legend> 
                    <div className="space-y-4 pt-2"> 
                        {group.items.map((item: any, itemIndex: number) => ( 
                            <div key={itemIndex} className="p-3 border-t"> 
                                <h4 className="font-semibold text-gray-700 mb-3">{item.label}</h4> 
                                <div className="space-y-2"> 
                                    {item.options.map((option: any, optionIndex: number) => ( 
                                        <label key={optionIndex} className="flex items-start p-2 rounded-md hover:bg-gray-100 cursor-pointer"> 
                                            <input type="radio" name={`comp-${group.name}-${item.key}`} value={option.score} checked={scores[group.name]?.[item.key] === option.score} onChange={() => handleScoreChange(group.name, item.key, option.score)} className="mt-1 mr-3 h-4 w-4" /> 
                                            <span className="text-sm text-gray-600">{option.text}</span> 
                                            <span className="ml-auto font-semibold text-blue-600">{option.score}</span> 
                                        </label> 
                                    ))} 
                                </div> 
                            </div> 
                        ))} 
                    </div> 
                </fieldset> 
            )); 
        } 
        if (proposal.program.kategori === 'Pengabdian') { 
            return criteria.map((section: any, sectionIndex: number) => ( 
                <fieldset key={sectionIndex} className="border p-4 rounded-lg"> 
                    <legend className="px-2 font-bold text-lg text-gray-800 flex justify-between w-full"> 
                        <span>{section.title}</span> 
                        <span>Skor Maks: {section.maxScore}</span> 
                    </legend> 
                    <div className="space-y-4 pt-2"> 
                        {section.components.map((component: any, componentIndex: number) => ( 
                            <div key={componentIndex} className="p-3 border-t"> 
                                <h4 className="font-semibold text-gray-700 mb-3">{component.name}</h4> 
                                <div className="space-y-2"> 
                                    {component.options.map((option: any, optionIndex: number) => ( 
                                    <label key={optionIndex} className="flex items-start p-2 rounded-md hover:bg-gray-100 cursor-pointer"> 
                                        <input 
                                            type="radio" 
                                            name={`comp-${sectionIndex}-${componentIndex}`} 
                                            value={option.score} 
                                            checked={scores[`${section.title}-${componentIndex}`] === option.score} 
                                            onChange={() => handleScoreChange(`${section.title}-${componentIndex}`, null, option.score)} 
                                            className="mt-1 mr-3 h-4 w-4" 
                                        /> 
                                        <span className="text-sm text-gray-600">{option.text}</span> 
                                        <span className="ml-auto font-semibold text-blue-600">{option.score}</span> 
                                    </label> 
                                    ))} 
                                </div> 
                            </div> 
                        ))} 
                    </div> 
                </fieldset> 
            )); 
        } 
        return null;
    };


    return (
        <Modal onClose={onClose} size="5xl">
            <form onSubmit={handleSubmit} className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{criteria?.title || 'Formulir Penilaian'}</h2>
                <p className="text-gray-600 mb-6">Proposal: <span className="font-semibold">{proposal.judul}</span></p>

                <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <Paperclip className="w-5 h-5 mr-2 text-blue-600"/>
                            {isOutputReview ? 'Lihat Detail Luaran Terunggah' : 'Lihat Detail & Berkas Proposal'}
                        </h3>
                        <button type="button" className="text-blue-600 font-semibold text-sm flex items-center">
                            {showDetails ? 'Sembunyikan' : 'Tampilkan'}
                            {showDetails ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                        </button>
                    </div>
                    {showDetails && (
                        isOutputReview 
                            ? <div className="mt-4 pt-4 border-t border-blue-200"><SubmittedOutputsViewer proposal={proposal} /></div>
                            : <SubstanceDetails proposal={proposal} />
                    )}
                </div>

                <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-4">
                    {renderAssessmentForm()}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Catatan & Umpan Balik Umum</label>
                        <textarea value={catatan} onChange={e => setCatatan(e.target.value)} rows={4} className="mt-1 input-field text-gray-900"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rekomendasi Akhir</label>
                        <select value={rekomendasi} onChange={e => setRekomendasi(e.target.value)} className="mt-1 input-field text-gray-900" required>
                            <option value="">-- Pilih Rekomendasi --</option>
                            {isOutputReview ? (
                                <>
                                    <option value="Valid">Lengkap</option>
                                    <option value="Tidak Valid">Kurang Lengkap</option>
                                </>
                            ) : (
                                <>
                                    <option value="Didanai">Didanai</option>
                                    <option value="Didanai dengan Revisi">Didanai dengan Revisi</option>
                                    <option value="Ditolak">Ditolak</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>

                <div className="mt-8 pt-5 border-t flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="btn-secondary">Batal</button>
                    <button type="submit" className="btn-primary">Kirim Penilaian</button>
                </div>
            </form>
        </Modal>
    );
};

export default ReviewModal;