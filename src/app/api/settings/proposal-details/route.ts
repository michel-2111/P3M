// src/app/api/settings/proposal-details/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);
    const adminUser = session?.user as any;

    if (!adminUser || !adminUser.peran?.includes('admin_p3m')) {
        return new NextResponse(JSON.stringify({ message: 'Akses ditolak' }), { status: 403 });
    }

    const newProposalDetails = await request.json();

    if (!newProposalDetails.penelitian || !newProposalDetails.pengabdian) {
        return new NextResponse(JSON.stringify({ message: 'Input tidak valid' }), { status: 400 });
    }

    try {
        await prisma.setting.upsert({
            where: { settingKey: 'proposal_details' },
            update: { settingValue: newProposalDetails },
            create: { settingKey: 'proposal_details', settingValue: newProposalDetails },
        });

        return NextResponse.json({ message: 'Pengaturan detail proposal berhasil diperbarui!' });

    } catch (error) {
        console.error("Gagal memperbarui pengaturan detail proposal:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}