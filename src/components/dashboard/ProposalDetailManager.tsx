// src/components/dashboard/ProposalDetailManager.tsx
"use client";

import { ProposalDetailField, Setting } from "@/types";
import { Plus, Save, Trash2, Edit } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';

interface ProposalDetailManagerProps {
    proposalDetailSettings: Setting['proposal_details'];
    refreshData: () => Promise<void>;
}

const ProposalDetailManager = ({ proposalDetailSettings, refreshData }: ProposalDetailManagerProps) => {
    const [details, setDetails] = useState(proposalDetailSettings || { penelitian: [], pengabdian: [] });

    const handleFieldChange = (category: 'penelitian' | 'pengabdian', fieldId: string, field: keyof ProposalDetailField, value: string | boolean) => {
        setDetails(prev => ({
            ...prev,
            [category]: prev[category].map(f => 
                f.id === fieldId ? { ...f, [field]: value } : f
            )
        }));
    };

    const addField = (category: 'penelitian' | 'pengabdian') => {
        const newField: ProposalDetailField = { id: uuidv4(), key: 'field_baru', label: 'Label Baru', type: 'textarea', isRequired: true };
        setDetails(prev => ({
            ...prev,
            [category]: [...prev[category], newField]
        }));
    };

    const removeField = (category: 'penelitian' | 'pengabdian', fieldId: string) => {
        setDetails(prev => ({
            ...prev,
            [category]: prev[category].filter(f => f.id !== fieldId)
        }));
    };

    const handleSave = async () => {
        const toastId = toast.loading('Menyimpan pengaturan...');
        try {
            const response = await fetch('/api/settings/proposal-details', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details),
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
                    <Edit className="w-6 h-6 mr-3 text-blue-600"/>
                    Pengaturan Detail Isian Proposal
                </h2>
                <button onClick={handleSave} className="btn-primary flex items-center">
                    <Save className="w-4 h-4 mr-2"/> Simpan Pengaturan
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(['penelitian', 'pengabdian'] as const).map(category => (
                    <div key={category}>
                        <h3 className="text-lg font-semibold mb-4 border-b pb-2 capitalize text-gray-900">{category}</h3>
                        <div className="space-y-4">
                            {details?.[category]?.map((field) => (
                                <div key={field.id} className="bg-gray-50 border p-3 rounded-lg space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={field.label}
                                            onChange={(e) => handleFieldChange(category, field.id, 'label', e.target.value)}
                                            className="input-field flex-grow text-gray-900"
                                            placeholder="Label Form (e.g., Pendahuluan)"
                                        />
                                        <button onClick={() => removeField(category, field.id)} className="text-red-500 hover:text-red-700 p-2">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={field.key}
                                            onChange={(e) => handleFieldChange(category, field.id, 'key', e.target.value)}
                                            className="input-field flex-grow text-gray-900 text-xs font-mono"
                                            placeholder="Kunci Data (e.g., pendahuluan)"
                                        />
                                        <label className="flex items-center space-x-2 text-sm whitespace-nowrap">
                                            <input 
                                                type="checkbox" 
                                                checked={field.isRequired} 
                                                onChange={(e) => handleFieldChange(category, field.id, 'isRequired', e.target.checked)}
                                                className="h-4 w-4 rounded text-blue-600"
                                            />
                                            <span className="text-gray-800" >Wajib</span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => addField(category)} className="btn-secondary text-xs mt-2 flex items-center">
                                <Plus size={14} className="mr-1"/> Tambah Kolom Isian
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProposalDetailManager;