// src/app/api/settings/schedules/route.ts

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

    const newSchedules = await request.json();

    if (!newSchedules.proposalPeriod || !newSchedules.luaranPeriod || !newSchedules.substanceReviewPeriod || !newSchedules.progressReviewPeriod || !newSchedules.finalReviewPeriod) {
        return new NextResponse(JSON.stringify({ message: 'Input tidak valid, semua periode harus ada.' }), { status: 400 });
    }

    try {
        const updatedSetting = await prisma.setting.upsert({
        where: { settingKey: 'schedules', },
        update: { settingValue: newSchedules, },
        create: { settingKey: 'schedules', settingValue: newSchedules, },
        });

        return NextResponse.json({ message: 'Jadwal berhasil diperbarui!', data: updatedSetting });

    } catch (error) {
        console.error("Gagal memperbarui jadwal:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}