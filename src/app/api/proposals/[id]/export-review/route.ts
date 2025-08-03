// src/app/api/proposals/[id]/export-review/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import prisma from "@/lib/prisma";

// Fungsi helper baru untuk membuat CSV yang lebih detail
function convertToDetailedCSV(proposal: any, reviews: any[]): string {
    const escape = (str: any) => `"${String(str || '').replace(/"/g, '""')}"`;
    let csvContent = "";

    // Bagian 1: Informasi Proposal
    csvContent += "INFORMASI PROPOSAL\n";
    csvContent += `Judul,${escape(proposal.judul)}\n`;
    csvContent += `Ketua Tim,${escape(proposal.ketua.namaLengkap)}\n`;
    csvContent += `Skema,${escape(proposal.skema)}\n\n`;

    // Bagian 2: Rincian per Reviewer
    reviews.forEach((review, index) => {
        csvContent += `HASIL REVIEWER ${index + 1}\n`;
        csvContent += `Nama Reviewer,${escape(review.reviewer.namaLengkap)}\n`;
        csvContent += `Rekomendasi Akhir,${escape(review.rekomendasi)}\n`;
        csvContent += `Total Skor,${review.totalSkor || 0}\n\n`;
        
        csvContent += "Rincian Skor Penilaian\n";
        csvContent += "Kriteria,Skor\n";
        
        // Loop melalui skor di dalam JSON
        const scores = review.skor || {};
        for (const key in scores) {
            if (typeof scores[key] === 'object' && scores[key] !== null) {
                // Untuk skor penelitian yang berstruktur
                for (const subKey in scores[key]) {
                    csvContent += `${escape(key)} - ${escape(subKey)},${scores[key][subKey]}\n`;
                }
            } else {
                // Untuk skor pengabdian yang lebih sederhana
                csvContent += `${escape(key)},${scores[key]}\n`;
            }
        }
        
        csvContent += `\nCatatan dari Reviewer,\n`;
        csvContent += `${escape(review.catatan)}\n\n\n`;
    });

    return csvContent;
}


export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.peran?.includes('admin_p3m')) {
        return new NextResponse("Akses ditolak", { status: 403 });
    }

    try {
        const resolvedParams = await params;  // ✅ Await params
        const proposalId = parseInt(resolvedParams.id, 10);
        
        const proposal = await prisma.proposal.findUnique({
            where: { id: proposalId },
            include: { ketua: true }
        });

        if (!proposal) {
            return new NextResponse("Proposal tidak ditemukan", { status: 404 });
        }

        const reviews = await prisma.review.findMany({
            where: { proposalId: proposalId, rekomendasi: { not: null } },
            include: { reviewer: true }
        });

        if (reviews.length === 0) {
            return new NextResponse("Belum ada hasil review untuk proposal ini", { status: 404 });
        }

        const csv = convertToDetailedCSV(proposal, reviews);
        const filename = `hasil-review-${proposal.judul.replace(/\s+/g, '-')}.csv`;

        return new Response(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });

    } catch (error) {
        console.error("EXPORT_DETAIL_REVIEW_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}