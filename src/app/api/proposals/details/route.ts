// src/app/api/proposals/details/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.peran?.includes('admin_p3m')) {
            return new NextResponse(JSON.stringify({ message: "Akses ditolak" }), { status: 403 });
        }

    // Ambil query parameter dari URL
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    const jurusan = searchParams.get('jurusan');

    if (!year || !jurusan) {
        return NextResponse.json({ message: "Parameter 'year' dan 'jurusan' dibutuhkan" }, { status: 400 });
    }

    try {
        const successStatus = "berhasil";

        // Query untuk mengambil detail proposal dari kedua tabel
        const proposals = await prisma.$queryRaw`
        SELECT judul, skema, nip_ketua
        FROM (
            SELECT judul, skema, nip_ketua, "tanggal_dibuat", jurusan, status FROM "penelitian"
            UNION ALL
            SELECT judul, skema, nip_ketua, "tanggal_dibuat", jurusan, status FROM "pengabdian"
        ) AS all_proposals
        WHERE 
            status = ${successStatus} AND
            jurusan = ${jurusan} AND
            EXTRACT(YEAR FROM "tanggal_dibuat") = ${Number(year)};
        `;

        return NextResponse.json(proposals);

    } catch (error) {
        console.error("[PROPOSALS_DETAILS_GET]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}