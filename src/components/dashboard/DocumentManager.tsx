// src/components/dashboard/DocumentManager.tsx
"use client";

import { DocumentSettingItem, Setting } from "@/types";
import { Plus, Save, Settings2, Trash2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';


interface DocumentManagerProps {
    documentSettings: Setting['document_settings'];
    refreshData: () => Promise<void>;
}

const DocumentManager = ({ documentSettings, refreshData }: DocumentManagerProps) => {
    const [docs, setDocs] = useState(documentSettings || { penelitian: [], pengabdian: [] });

    const handleDocChange = (category: 'penelitian' | 'pengabdian', docId: string, field: 'name' | 'isRequired', value: string | boolean) => {
        setDocs(prev => ({
            ...prev,
            [category]: prev[category].map(doc => 
                doc.id === docId ? { ...doc, [field]: value } : doc
            )
        }));
    };

    const addDocument = (category: 'penelitian' | 'pengabdian') => {
        const newDoc: DocumentSettingItem = { id: uuidv4(), name: 'Berkas Baru', isRequired: true };
        setDocs(prev => ({
            ...prev,
            [category]: [...prev[category], newDoc]
        }));
    };

    const removeDocument = (category: 'penelitian' | 'pengabdian', docId: string) => {
        setDocs(prev => ({
            ...prev,
            [category]: prev[category].filter(doc => doc.id !== docId)
        }));
    };

    const handleSave = async () => {
        const toastId = toast.loading('Menyimpan pengaturan...');
        try {
            const response = await fetch('/api/settings/documents', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(docs),
            });
            if (response.ok) {
                toast.success('Pengaturan berhasil disimpan!', { id: toastId });
                await refreshData();
            } else {
                throw new Error('Gagal menyimpan pengaturan.');
            }
        } catch (error: any) {
            toast.error(error.message, { id: toastId });
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Settings2 className="w-6 h-6 mr-3 text-blue-600"/>
                    Pengaturan Berkas Wajib Unggah
                </h2>
                <button onClick={handleSave} className="btn-primary flex items-center">
                    <Save className="w-4 h-4 mr-2"/> Simpan Pengaturan
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(['penelitian', 'pengabdian'] as const).map(category => (
                    <div key={category}>
                        <h3 className="text-lg font-semibold mb-4 border-b pb-2 capitalize text-gray-700">{category}</h3>
                        <div className="space-y-3">
                            {docs?.[category]?.map((doc) => (
                                <div key={doc.id} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={doc.name}
                                        onChange={(e) => handleDocChange(category, doc.id, 'name', e.target.value)}
                                        className="input-field flex-grow text-gray-900"
                                    />
                                    <label className="flex items-center space-x-2 text-sm whitespace-nowrap">
                                        <input 
                                            type="checkbox" 
                                            checked={doc.isRequired} 
                                            onChange={(e) => handleDocChange(category, doc.id, 'isRequired', e.target.checked)}
                                            className="h-4 w-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-700">Wajib</span>
                                    </label>
                                    <button onClick={() => removeDocument(category, doc.id)} className="text-red-500 hover:text-red-700 p-2">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            <button onClick={() => addDocument(category)} className="btn-secondary text-xs mt-2 flex items-center">
                                <Plus size={14} className="mr-1"/> Tambah Berkas
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocumentManager;