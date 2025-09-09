// src/components/dashboard/ProposalDetailTable.tsx
"use client";

import { useState, useEffect } from 'react';

interface ProposalDetail {
    judul: string;
    skema: string;
    nip_ketua: string;
}

interface Props {
    data: ProposalDetail[];
    isLoading: boolean;
    selection: {
        year: string;
        jurusan: string;
    };
}

// Atur jumlah item per halaman
const ITEMS_PER_PAGE = 5;

export const ProposalDetailTable = ({ data, isLoading, selection }: Props) => {
    // 1. State baru untuk melacak halaman saat ini
    const [currentPage, setCurrentPage] = useState(1);

    // 2. useEffect untuk mereset ke halaman 1 setiap kali data berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [data]);


    if (isLoading) {
        return <div className="mt-6 p-4 text-center">Memuat detail proposal...</div>;
    }

    // 3. Logika untuk memotong data sesuai halaman
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = data.slice(startIndex, endIndex);

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };


    return (
        <div className="mt-8 animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-800">
            Detail Proposal Didanai - Jurusan {selection.jurusan} ({selection.year})
        </h3>
        <div className="mt-4 overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Judul
                </th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skema
                </th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIP Ketua
                </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((proposal, index) => (
                <tr key={index}>
                    {/* 4. Padding diperkecil untuk tampilan compact */}
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {proposal.judul}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {proposal.skema}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {proposal.nip_ketua}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {/* 5. Kontrol Paging */}
        {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
            <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Sebelumnya
            </button>
            <span className="text-sm text-gray-700">
                Halaman {currentPage} dari {totalPages}
            </span>
            <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Berikutnya
            </button>
            </div>
        )}
        </div>
    );
};