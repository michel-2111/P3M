// src/components/dashboard/AssessmentCriteriaManager.tsx
"use client";

import { Setting } from "@/types";
import { Edit3, Plus, Save, Trash2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';

interface AssessmentCriteriaManagerProps {
    assessmentCriteria: Setting['assessment_criteria'];
    refreshData: () => Promise<void>;
}

const handleFieldChange = (setter: React.Dispatch<React.SetStateAction<any>>, path: (string | number)[], value: any) => {
    setter((prev: any) => {
        const newCriteria = JSON.parse(JSON.stringify(prev));
        let current = newCriteria;
        path.slice(0, -1).forEach(p => { current = current[p]; });
        current[path[path.length - 1]] = value;
        return newCriteria;
    });
};

const handleAddItem = (setter: React.Dispatch<React.SetStateAction<any>>, path: (string | number)[], newItem: any) => {
    setter((prev: any) => {
        const newCriteria = JSON.parse(JSON.stringify(prev));
        let current = newCriteria;
        path.forEach(p => { current = current[p]; });
        current.push(newItem);
        return newCriteria;
    });
};

const handleRemoveItem = (setter: React.Dispatch<React.SetStateAction<any>>, path: (string | number)[]) => {
    setter((prev: any) => {
        const newCriteria = JSON.parse(JSON.stringify(prev));
        let parent = newCriteria;
        path.slice(0, -1).forEach(p => { parent = parent[p]; });
        parent.splice(path[path.length - 1], 1);
        return newCriteria;
    });
};

const PenelitianEditor = ({ schemeData, path, criteria, setCriteria }: any) => {
    const onChange = (p: any, v: any) => handleFieldChange(setCriteria, p, v);
    const onAddItem = (p: any, n: any) => handleAddItem(setCriteria, p, n);
    const onRemoveItem = (p: any) => handleRemoveItem(setCriteria, p);
    
    return (
    <div className="space-y-4">
        {schemeData.groups.map((group: any, groupIndex: number) => (
            <div key={groupIndex} className="bg-gray-50 p-4 rounded-lg border text-gray-700">
                <div className="flex justify-between items-center mb-2">
                    <input value={group.name} onChange={(e) => onChange([...path, 'groups', groupIndex, 'name'], e.target.value)} className="font-bold text-lg text-gray-800 bg-transparent border-b-2 border-gray-200 focus:border-blue-500 outline-none w-1/2" placeholder="Nama Grup" />
                    <div className="flex items-center space-x-2"><label className="text-sm font-medium">Bobot:</label><input type="number" value={group.weight} onChange={(e) => onChange([...path, 'groups', groupIndex, 'weight'], parseInt(e.target.value) || 0)} className="input-field w-20 text-center" /><span>%</span><button onClick={() => onRemoveItem([...path, 'groups', groupIndex])} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18}/></button></div>
                </div>
                {group.items.map((item: any, itemIndex: number) => (
                    <div key={itemIndex} className="ml-4 mt-3 pt-3 border-t">
                        <textarea value={item.label} onChange={(e) => onChange([...path, 'groups', groupIndex, 'items', itemIndex, 'label'], e.target.value)} className="input-field text-sm mb-2" rows={2} placeholder="Label Kriteria Penilaian" />
                        {item.options.map((option: any, optionIndex: number) => (
                            <div key={optionIndex} className="flex items-center space-x-2 pl-4 mt-1">
                                <input value={option.text} onChange={(e) => onChange([...path, 'groups', groupIndex, 'items', itemIndex, 'options', optionIndex, 'text'], e.target.value)} className="input-field text-sm flex-grow" placeholder="Teks Opsi"/>
                                <input type="number" value={option.score} onChange={(e) => onChange([...path, 'groups', groupIndex, 'items', itemIndex, 'options', optionIndex, 'score'], parseInt(e.target.value) || 0)} className="input-field w-20 text-center text-sm" placeholder="Skor" />
                                <button onClick={() => onRemoveItem([...path, 'groups', groupIndex, 'items', itemIndex, 'options', optionIndex])} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16}/></button>
                            </div>
                        ))}
                        <button onClick={() => onAddItem([...path, 'groups', groupIndex, 'items', itemIndex, 'options'], { text: 'Opsi Baru', score: 0 })} className="btn-secondary text-xs mt-2 flex items-center"><Plus size={14} className="mr-1"/>Tambah Opsi</button>
                    </div>
                ))}
                <button onClick={() => onAddItem([...path, 'groups', groupIndex, 'items'], { label: 'Item Baru', key: `item_${uuidv4()}`, options: [] })} className="btn-secondary text-xs mt-3 flex items-center"><Plus size={14} className="mr-1"/>Tambah Item Penilaian</button>
            </div>
        ))}
        <button onClick={() => onAddItem([...path, 'groups'], { name: 'Grup Baru', weight: 10, items: [] })} className="btn-primary flex items-center"><Plus size={16} className="mr-1"/>Tambah Grup Penilaian</button>
    </div>
    );
};

const PengabdianEditor = ({ schemeData, path, criteria, setCriteria }: any) => {
    const onChange = (p: any, v: any) => handleFieldChange(setCriteria, p, v);
    const onAddItem = (p: any, n: any) => handleAddItem(setCriteria, p, n);
    const onRemoveItem = (p: any) => handleRemoveItem(setCriteria, p);

    return (
    <div className="space-y-4">
        {schemeData.map((section: any, sectionIndex: number) => (
            <div key={sectionIndex} className="bg-gray-50 p-4 rounded-lg border text-gray-700">
                <div className="flex justify-between items-center mb-2">
                    <input value={section.title} onChange={(e) => onChange([...path, sectionIndex, 'title'], e.target.value)} className="font-bold text-lg text-gray-800 bg-transparent border-b-2 w-1/2" placeholder="Nama Sesi"/>
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">Skor Maks:</label>
                        <input type="number" value={section.maxScore} onChange={(e) => onChange([...path, sectionIndex, 'maxScore'], parseInt(e.target.value) || 0)} className="input-field w-24 text-center" />
                        <button onClick={() => onRemoveItem([...path, sectionIndex])} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18}/></button>
                    </div>
                </div>
                {section.components.map((component: any, componentIndex: number) => (
                    <div key={componentIndex} className="ml-4 mt-3 pt-3 border-t">
                        <textarea value={component.name} onChange={(e) => onChange([...path, sectionIndex, 'components', componentIndex, 'name'], e.target.value)} className="input-field text-sm mb-2" rows={2} placeholder="Nama Komponen Penilaian" />
                        {component.options.map((option: any, optionIndex: number) => (
                            <div key={optionIndex} className="flex items-center space-x-2 pl-4 mt-1">
                                <input value={option.text} onChange={(e) => onChange([...path, sectionIndex, 'components', componentIndex, 'options', optionIndex, 'text'], e.target.value)} className="input-field text-sm flex-grow" placeholder="Teks Opsi"/>
                                <input type="number" value={option.score} onChange={(e) => onChange([...path, sectionIndex, 'components', componentIndex, 'options', optionIndex, 'score'], parseInt(e.target.value) || 0)} className="input-field w-20 text-center text-sm" placeholder="Skor" />
                                <button onClick={() => onRemoveItem([...path, sectionIndex, 'components', componentIndex, 'options', optionIndex])} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16}/></button>
                            </div>
                        ))}
                        <button onClick={() => onAddItem([...path, sectionIndex, 'components', componentIndex, 'options'], { text: 'Opsi Baru', score: 0 })} className="btn-secondary text-xs mt-2 flex items-center"><Plus size={14} className="mr-1"/>Tambah Opsi</button>
                    </div>
                ))}
                <button onClick={() => onAddItem([...path, sectionIndex, 'components'], { name: 'Komponen Baru', options: [] })} className="btn-secondary text-xs mt-3 flex items-center"><Plus size={14} className="mr-1"/>Tambah Komponen Penilaian</button>
            </div>
        ))}
        <button onClick={() => onAddItem([...path], { title: "Sesi Baru", maxScore: 100, components: [] })} className="btn-primary flex items-center"><Plus size={16} className="mr-1"/>Tambah Sesi Penilaian</button>
    </div>
    );
};

const AssessmentCriteriaManager = ({ assessmentCriteria, refreshData }: AssessmentCriteriaManagerProps) => {
    const [criteria, setCriteria] = useState(assessmentCriteria);
    const [selectedScheme, setSelectedScheme] = useState('');

    const handleSave = async () => {
        const toastId = toast.loading('Menyimpan kriteria...');
        try {
            const response = await fetch('/api/settings/assessment-criteria', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(criteria),
            });
            if (response.ok) {
                toast.success('Kriteria berhasil disimpan!', { id: toastId });
                await refreshData();
            } else { 
                const error = await response.json();
                throw new Error(error.message || 'Gagal menyimpan kriteria.');
            }
        } catch (error: any) {
            toast.error(error.message, { id: toastId });
        }
    };

    const renderEditor = () => {
        if (!selectedScheme) return <p className="text-center text-gray-500 py-10">Pilih skema penilaian untuk mulai mengedit.</p>;

        let schemeData;
        let path: (string | number)[];

        if (selectedScheme.includes('/')) {
            const [category, programId] = selectedScheme.split('/');
            schemeData = (criteria as any)[category]?.[programId];
            path = [category, programId];
        } else {
            schemeData = (criteria as any)[selectedScheme];
            path = [selectedScheme];
        }

        if (!schemeData) return <p className="text-center text-red-500 py-10">Data untuk skema ini tidak ditemukan.</p>;

        if (schemeData.groups) {
            return <PenelitianEditor schemeData={schemeData} path={path} setCriteria={setCriteria} />;
        }
        
        if (Array.isArray(schemeData)) { // Struktur untuk Pengabdian
            return <PengabdianEditor schemeData={schemeData} path={path} setCriteria={setCriteria} />;
        }
        
        return <p className="text-center text-gray-500">Editor untuk tipe skema ini belum diimplementasikan.</p>;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Edit3 className="w-6 h-6 mr-3 text-blue-600"/>
                    Pengaturan Kriteria Penilaian
                </h2>
                <button onClick={handleSave} className="btn-primary flex items-center">
                    <Save className="w-4 h-4 mr-2"/> Simpan Perubahan
                </button>
            </div>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Skema</label>
                <select value={selectedScheme} onChange={e => setSelectedScheme(e.target.value)} className="input-field text-gray-700">
                    <option value="">-- Pilih Skema untuk Diedit --</option>
                    <optgroup label="Penelitian" className="font-semibold">
                        {Object.keys(criteria.penelitian || {}).map(key => <option key={key} value={`penelitian/${key}`}>{criteria.penelitian[key].title || key}</option>)}
                    </optgroup>
                    <optgroup label="Pengabdian" className="font-semibold">
                        {Object.keys(criteria.pengabdian || {}).map(key => <option key={key} value={`pengabdian/${key}`}>{key}</option>)}
                    </optgroup>
                    <optgroup label="Luaran">
                        <option value="output_kemajuan">Laporan Kemajuan</option>
                        <option value="output_akhir">Laporan Akhir</option>
                    </optgroup>
                </select>
            </div>

            <div className="mt-6">
                {renderEditor()}
            </div>
        </div>
    );
};

export default AssessmentCriteriaManager;