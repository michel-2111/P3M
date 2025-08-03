// src/components/modals/LogbookModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Proposal } from '@/types';
import Modal from '@/components/common/Modal';
import * as XLSX from 'xlsx';
import { Paperclip, Plus, Trash2, Edit, XCircle, Download, LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface LogbookEntry {
    id: number;
    tanggal: string;
    kegiatan: string;
    bukti: string[];
}

interface LogbookModalProps {
    proposal: Proposal;
    onClose: () => void;
    onAddLogbook: (proposalId: number, newLogEntry: any) => void;
    onEditLogbook: (logId: number, updatedLogEntry: any) => void;
    onDeleteLogbook: (logId: number) => void;
    isReadOnly?: boolean;
}

const LogbookModal = ({ proposal, onClose, onAddLogbook, onEditLogbook, onDeleteLogbook, isReadOnly = false }: LogbookModalProps) => {
    const [tanggal, setTanggal] = useState('');
    const [kegiatan, setKegiatan] = useState('');
    const [buktiFiles, setBuktiFiles] = useState<File[]>([]);
    const [editingLog, setEditingLog] = useState<LogbookEntry | null>(null);

    const [isUploading, setIsUploading] = useState(false);

    const isEditing = editingLog !== null;

    useEffect(() => {
        if (isEditing) {
            setTanggal(new Date(editingLog.tanggal).toISOString().split('T')[0]);
            setKegiatan(editingLog.kegiatan);
            setBuktiFiles([]);
        } else {
            setTanggal('');
            setKegiatan('');
            setBuktiFiles([]);
        }
    }, [editingLog, isEditing]);

    const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setBuktiFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setBuktiFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tanggal || !kegiatan) return;
        
        setIsUploading(true);
        const toastId = toast.loading('Menyiapkan data logbook...');

        try {
            let uploadedFileUrls: string[] = [];

            if (buktiFiles.length > 0) {
                for (let i = 0; i < buktiFiles.length; i++) {
                    const file = buktiFiles[i];
                    toast.loading(`Mengunggah bukti ${i + 1}/${buktiFiles.length}: ${file.name}`, { id: toastId });

                    const signedUrlResponse = await fetch('/api/uploads', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ fileName: file.name, proposalId: proposal.id }),
                    });
                    if (!signedUrlResponse.ok) throw new Error('Gagal mendapatkan izin unggah.');
                    const { signedUrl, publicUrl } = await signedUrlResponse.json();

                    const uploadResponse = await fetch(signedUrl, {
                        method: 'PUT',
                        body: file,
                        headers: { 'Content-Type': file.type },
                    });
                    if (!uploadResponse.ok) throw new Error(`Gagal mengunggah ${file.name}.`);
                    
                    uploadedFileUrls.push(publicUrl);
                }
            }
            
            toast.loading('Menyimpan entri logbook...', { id: toastId });

            if (isEditing) {
                const updatedLogEntry = {
                    tanggal,
                    kegiatan,
                    bukti: uploadedFileUrls.length > 0 ? uploadedFileUrls : editingLog.bukti,
                };
                await onEditLogbook(editingLog.id, updatedLogEntry);
                toast.success('Entri logbook berhasil diperbarui!', { id: toastId });
            } else {
                const newLogEntry = {
                    tanggal,
                    kegiatan,
                    bukti: uploadedFileUrls,
                };
                await onAddLogbook(proposal.id, newLogEntry);
                toast.success('Entri logbook berhasil ditambahkan!', { id: toastId });

                setTanggal('');
                setKegiatan('');
                setBuktiFiles([]);
            }
            
            setEditingLog(null);

        } catch (error: any) {
            toast.error(error.message, { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    const handleExport = () => {
        const dataToExport = proposal.logbookEntries.map(log => ({
            Tanggal: new Date(log.tanggal).toLocaleDateString('id-ID'),
            Kegiatan: log.kegiatan,
            Bukti: Array.isArray(log.bukti) ? log.bukti.join(', ') : ''
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Logbook");

        worksheet['!cols'] = [{ wch: 15 }, { wch: 50 }, { wch: 30 }];

        XLSX.writeFile(workbook, `Logbook_${proposal.judul.replace(/ /g, "_")}.xlsx`);
    };

    return (
        <Modal onClose={onClose} size="4xl">
            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Logbook Kemajuan</h2>
                <p className="text-gray-600 mb-6">Proposal: <span className="font-semibold">{proposal.judul}</span></p>
                
                {!isReadOnly && (
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">{isEditing ? 'Edit Entri' : 'Tambah Entri Baru'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tanggal Kegiatan</label>
                                <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} className="mt-1 input-field text-gray-900" required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Uraian Kegiatan</label>
                                <textarea value={kegiatan} onChange={e => setKegiatan(e.target.value)} rows={3} className="mt-1 input-field text-gray-900" required></textarea>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Bukti (Opsional)</label>
                                {isEditing && <p className="text-xs text-yellow-600">Mengunggah file baru akan menggantikan semua bukti lama untuk entri ini.</p>}
                                <ul className="mt-2 space-y-2">
                                    {buktiFiles.map((file, index) => (
                                        <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md text-sm">
                                            <span className="text-gray-800 truncate">{file.name}</span>
                                            <button type="button" onClick={() => handleRemoveFile(index)} className="text-red-500 hover:text-red-700 ml-2">
                                                <Trash2 size={16}/>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <label htmlFor="file-upload" className="mt-2 btn-secondary text-xs cursor-pointer inline-flex items-center">
                                    <Plus size={14} className="mr-1"/> Tambah Bukti
                                </label>
                                <input id="file-upload" type="file" multiple onChange={handleAddFile} className="hidden"/>
                            </div>
                        </div>
                        <div className="text-right mt-4 flex justify-end items-center space-x-2">
                            {isEditing && (
                                <button type="button" onClick={() => setEditingLog(null)} className="btn-secondary flex items-center">
                                    <XCircle size={16} className="mr-1"/> Batal
                                </button>
                            )}
                            <button type="submit" className="btn-primary">
                                {isEditing ? 'Simpan Perubahan' : 'Tambah ke Logbook'}
                            </button>
                        </div>
                    </form>
                )}

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Catatan Logbook</h3>
                        <button onClick={handleExport} className="btn-secondary text-xs flex items-center">
                            <Download size={14} className="mr-1"/> Export ke Excel
                        </button>
                    </div>
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                        {proposal.logbookEntries && proposal.logbookEntries.length > 0 ? (
                            [...proposal.logbookEntries].reverse().map((log: any) => (
                                <div key={log.id} className="bg-gray-50 p-4 rounded-lg border group relative">
                                    {!isReadOnly && (
                                        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setEditingLog(log)} className="p-1 hover:bg-gray-200 rounded"><Edit size={14} className="text-gray-600"/></button>
                                            <button onClick={() => onDeleteLogbook(log.id)} className="p-1 hover:bg-gray-200 rounded"><Trash2 size={14} className="text-red-500"/></button>
                                        </div>
                                    )}
                                    <p className="font-semibold text-gray-800">{new Date(log.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p className="text-gray-600 mt-2 whitespace-pre-wrap">{log.kegiatan}</p>
                                    {log.bukti && Array.isArray(log.bukti) && log.bukti.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-xs text-gray-500 flex items-center"><Paperclip size={14} className="mr-1.5"/>Bukti:</p>
                                            <ul className="list-none ml-4 mt-1 space-y-1">
                                                {log.bukti.map((url: string, i: number) => (
                                                    <li key={i}>
                                                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center">
                                                            <LinkIcon size={12} className="mr-1.5"/>
                                                            {url.split('/').pop()}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-4">Belum ada entri logbook.</p>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default LogbookModal;
