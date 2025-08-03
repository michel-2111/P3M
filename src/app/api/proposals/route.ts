// src/app/api/proposals/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
        return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    const userIdKetua = (session.user as any).id;

    try {
        const body = await request.json();
        const { programId, judul, abstrak, anggotaIds, detailProposal } = body;

        if (!programId || !judul || !abstrak || !anggotaIds) {
        return new NextResponse(JSON.stringify({ message: "Data tidak lengkap" }), { status: 400 });
        }
        
        const program = await prisma.program.findUnique({ where: { id: programId } });
        if (!program) {
            return new NextResponse(JSON.stringify({ message: "Program tidak ditemukan" }), { status: 404 });
        }
        const newProposalCategory = program.kategori;

        const userProposals = await prisma.proposal.findMany({
            where: {
                OR: [
                    { userIdKetua: userIdKetua },
                    { anggotaTim: { some: { userId: userIdKetua } } }
                ],
                status: { notIn: ['Ditolak', 'Selesai'] }
            },
            include: { program: true }
        });

        let leaderCount = 0;
        let memberCount = 0;
        userProposals.forEach(p => {
            if (p.program.kategori === newProposalCategory) {
                if (p.userIdKetua === userIdKetua) {
                    leaderCount++;
                } else {
                    memberCount++;
                }
            }
        });

        if (leaderCount >= 1) {
            return new NextResponse(JSON.stringify({ message: `Batas tercapai: Anda sudah menjadi ketua di 1 proposal ${newProposalCategory}.` }), { status: 403 });
        }
        if (leaderCount + memberCount >= 2) {
            return new NextResponse(JSON.stringify({ message: `Batas tercapai: Anda sudah terlibat dalam 2 proposal ${newProposalCategory}.` }), { status: 403 });
        }

        const newProposal = await prisma.proposal.create({
        data: {
            programId,
            judul,
            abstrak,
            userIdKetua,
            status: "Menunggu Persetujuan Judul",
            detailProposal,
            dokumenDiunggah: {},
            anggotaTim: {
            create: anggotaIds.map((id: string) => ({
                userId: id,
                statusPersetujuan: "Menunggu",
            })),
            },
        },
        });

    const admins = await prisma.user.findMany({
        where: { peran: { array_contains: ['admin_p3m'] } }
    });
    
    const notifications = admins.map(admin => ({
        userId: admin.id,
        pesan: `Proposal baru "${judul}" menunggu persetujuan judul.`,
        link: '/dashboard'
    }));

    await prisma.notification.createMany({
        data: notifications,
    });

        return NextResponse.json(newProposal);
    } catch (error) {
        console.error("PROPOSAL_CREATION_ERROR", error);
        return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
