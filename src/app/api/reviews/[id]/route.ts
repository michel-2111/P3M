// src/app/api/reviews/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import prisma from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
    ) {
    const session = await getServerSession(authOptions);
    const currentUser = (session?.user as any);
    if (!currentUser?.id) {
        return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const reviewId = parseInt(params.id, 10);
    const body = await request.json();
    const { scores, totalSkor, catatan, rekomendasi } = body;

    try {
        const review = await prisma.review.findUnique({ where: { id: reviewId } });
        if (!review || review.reviewerId !== currentUser.id) {
            return new NextResponse(JSON.stringify({ message: "Tugas review tidak ditemukan atau bukan milik Anda." }), { status: 404 });
        }

        await prisma.review.update({
            where: { id: reviewId },
            data: {
                skor: body.scores,
                catatan: body.catatan,
                rekomendasi: body.rekomendasi,
                totalSkor: totalSkor
            }
        });

        return NextResponse.json({ message: "Review berhasil dikirim." });
    } catch (error) {
        console.error("REVIEW_SUBMIT_ERROR", error);
        return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
