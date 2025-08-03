// src/components/common/SubmittedOutputsViewer.tsx
"use client";

import { Proposal } from "@/types";
import { Link as LinkIcon, Paperclip } from "lucide-react";
import React from "react";

interface SubmittedOutputsViewerProps {
    proposal: Proposal;
}

const SubmittedOutputsViewer = ({ proposal }: SubmittedOutputsViewerProps) => {
    const program = proposal.program;
    const luaranWajib = (program.detailLainnya as any)?.outputs || [];
    const luaranTambahan = (proposal.detailProposal as any)?.luaranTambahan || [];

    return (
        <div className="space-y-4">
            {luaranWajib.length > 0 && (
                <div>
                    <h4 className="font-semibold text-gray-800 text-base mb-2">Luaran Wajib</h4>
                    <div className="space-y-3">
                        {luaranWajib.map((output: string, index: number) => {
                            const progress = proposal.detailProposal.luaranWajibProgress?.[index];
                            return (
                                <div key={index} className="bg-gray-100 p-3 rounded-lg border text-sm grid grid-cols-12 gap-4 items-center">
                                    <p className="font-semibold text-gray-900 col-span-5">{output}</p>
                                    <div className="col-span-3">
                                        <p className="text-xs font-medium text-gray-500">Status</p>
                                        <p className="font-semibold text-blue-600">{progress?.status || 'Belum Diisi'}</p>
                                    </div>
                                    <div className="col-span-4">
                                        <p className="text-xs font-medium text-gray-500">Berkas & Tautan</p>
                                        <div className="text-right text-xs">
                                            {progress?.fileName && <p className="flex items-center justify-start text-green-700 truncate"><Paperclip size={12} className="mr-1.5 flex-shrink-0"/>{progress.fileName}</p>}
                                            {progress?.url && <a href={progress.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-start text-blue-600 hover:underline truncate"><LinkIcon size={12} className="mr-1.5 flex-shrink-0"/>{progress.url}</a>}
                                            {!progress?.fileName && !progress?.url && <p className="text-gray-500">No File Chosen</p>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            
            {luaranTambahan.length > 0 && (
                <div>
                    <h4 className="font-semibold text-gray-800 text-base mb-2">Luaran Tambahan</h4>
                    <div className="space-y-3">
                        {luaranTambahan.map((output: string, index: number) => {
                            const progress = proposal.detailProposal.luaranTambahanProgress?.[index];
                            return (
                                <div key={index} className="bg-gray-100 p-3 rounded-lg border text-sm grid grid-cols-12 gap-4 items-center">
                                    <p className="font-semibold text-gray-900 col-span-5">{output}</p>
                                    <div className="col-span-3">
                                        <p className="text-xs font-medium text-gray-500">Status</p>
                                        <p className="font-semibold text-blue-600">{progress?.status || 'Belum Diisi'}</p>
                                    </div>
                                    <div className="col-span-4">
                                        <p className="text-xs font-medium text-gray-500">Berkas & Tautan</p>
                                        <div className="text-right text-xs">
                                            {progress?.fileName && <p className="flex items-center justify-start text-green-700 truncate"><Paperclip size={12} className="mr-1.5 flex-shrink-0"/>{progress.fileName}</p>}
                                            {progress?.url && <a href={progress.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-start text-blue-600 hover:underline truncate"><LinkIcon size={12} className="mr-1.5 flex-shrink-0"/>{progress.url}</a>}
                                            {!progress?.fileName && !progress?.url && <p className="text-gray-500">No File Chosen</p>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmittedOutputsViewer;