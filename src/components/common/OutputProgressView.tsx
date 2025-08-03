// src/components/common/OutputProgressView.tsx
"use client";

import { Proposal } from "@/types";
import React from "react";

interface OutputProgressViewProps {
    proposal: Proposal;
}

const OutputSection = ({ title, outputs, progressData }: { title: string, outputs: string[], progressData: any }) => (
    <div>
        <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800">{title}</h3>
        <div className="space-y-4">
            {outputs.map((output, index) => {
                const currentProgress = progressData[index] || {};
                return (
                    <div key={index} className="bg-white p-4 rounded-lg border">
                        <p className="font-semibold text-gray-800">{output}</p>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 text-sm">
                            <p className="text-gray-600">Status: <span className="font-medium text-gray-900">{currentProgress.status || 'Belum Dilaporkan'}</span></p>
                            {currentProgress.fileName && <p className="text-gray-600">File: <span className="font-medium text-gray-900">{currentProgress.fileName}</span></p>}
                            {currentProgress.url && <p className="text-gray-600 col-span-2">URL: <a href={currentProgress.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">{currentProgress.url}</a></p>}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

const OutputProgressView = ({ proposal }: OutputProgressViewProps) => {
    const luaranWajibProgress = (proposal.detailProposal as any)?.luaranWajibProgress || {};
    const luaranTambahanProgress = (proposal.detailProposal as any)?.luaranTambahanProgress || {};
    const luaranTambahan = (proposal.detailProposal as any)?.luaranTambahan || [];

    return (
        <div className="space-y-8">
            <OutputSection 
                title="Luaran Wajib" 
                outputs={proposal.program.detailLainnya.outputs} 
                progressData={luaranWajibProgress}
            />
            
            {luaranTambahan.length > 0 && 
                <OutputSection 
                    title="Luaran Tambahan" 
                    outputs={luaranTambahan} 
                    progressData={luaranTambahanProgress}
                />
            }
        </div>
    );
};

export default OutputProgressView;
