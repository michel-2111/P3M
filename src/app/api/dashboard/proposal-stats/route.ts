// src/app/api/dashboard/proposal-stats/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.peran?.includes('admin_p3m')) {
        return new NextResponse(JSON.stringify({ message: "Akses ditolak" }), { status: 403 });
    }

    try {
        const successStatus = "berhasil"; // Pastikan status ini sesuai dengan data Anda

        // Query sudah disesuaikan dengan nama kolom 'tanggal_dibuat' dan struktur 2 tabel Anda.
        type QueryResult = { year: number; jurusan: string; penelitian_count: bigint; pengabdian_count: bigint; };

    // Query diubah untuk menghitung 'penelitian' dan 'pengabdian' secara terpisah
    const result: QueryResult[] = await prisma.$queryRaw`
        SELECT
            EXTRACT(YEAR FROM "tanggal_dibuat")::integer AS year,
            jurusan,
            COUNT(CASE WHEN type = 'penelitian' THEN 1 END)::bigint AS penelitian_count,
            COUNT(CASE WHEN type = 'pengabdian' THEN 1 END)::bigint AS pengabdian_count
        FROM (
            SELECT "tanggal_dibuat", jurusan, status, 'penelitian' as type FROM "penelitian"
            UNION ALL
            SELECT "tanggal_dibuat", jurusan, status, 'pengabdian' as type FROM "pengabdian"
        ) AS all_proposals
        WHERE status = ${successStatus}
        GROUP BY year, jurusan
        ORDER BY year DESC, jurusan ASC;
        `;

        // Format ulang hasil untuk dikirim sebagai JSON
        const formattedResult = result.map((item) => ({
        year: item.year,
        jurusan: item.jurusan,
        penelitian_count: Number(item.penelitian_count),
        pengabdian_count: Number(item.pengabdian_count),
        }));

        return NextResponse.json(formattedResult);
    } catch (error) {
        console.error("[DASHBOARD_STATS_GET]", error);
        return NextResponse.json({ message: "Internal Server Error", error: (error as Error).message }, { status: 500 });
    }
}