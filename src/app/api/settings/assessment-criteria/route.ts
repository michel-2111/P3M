// src/app/api/settings/assessment-criteria/route.ts

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

    const newCriteria = await request.json();

    if (!newCriteria) {
        return new NextResponse(JSON.stringify({ message: 'Input tidak valid' }), { status: 400 });
    }

    try {
        await prisma.setting.upsert({
            where: { settingKey: 'assessment_criteria' },
            update: { settingValue: newCriteria },
            create: { settingKey: 'assessment_criteria', settingValue: newCriteria },
        });

        return NextResponse.json({ message: 'Kriteria penilaian berhasil diperbarui!' });

    } catch (error) {
        console.error("Gagal memperbarui kriteria penilaian:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}