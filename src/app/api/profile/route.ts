// src/app/api/profile/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";


export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const currentUser = (session?.user as any);
    if (!currentUser?.id) {
        return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    try {
        const userProfile = await prisma.user.findUnique({
        where: { id: currentUser.id },
        // Pilih hanya field yang aman untuk ditampilkan
        select: {
            namaLengkap: true,
            nidnNim: true,
            jurusan: true,
            program_studi: true,
            nomor_rekening: true,
            jabatan_fungsional: true,
            sinta_score: true,
            sinta_id: true,
        },
        });

        if (!userProfile) {
        return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json(userProfile);
    } catch (error) {
        console.error("[PROFILE_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// Handler untuk MEMPERBARUI data profil pengguna saat ini
export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    const currentUser = (session?.user as any);

    if (!currentUser?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        
        // Ambil field yang diizinkan untuk diubah
        const {
        namaLengkap,
        jurusan,
        program_studi,
        nomor_rekening,
        jabatan_fungsional,
        sinta_score,
        sinta_id,
        } = body;

        const updatedUser = await prisma.user.update({
        where: { id: currentUser.id },
        data: {
            namaLengkap,
            jurusan,
            program_studi,
            nomor_rekening,
            jabatan_fungsional,
            // Pastikan sinta_score adalah angka atau null
            sinta_score: sinta_score ? parseInt(sinta_score, 10) : null,
            sinta_id,
        },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("[PROFILE_PATCH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}