// src/app/api/settings/documents/route.ts

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

    const newDocumentSettings = await request.json();

    if (!newDocumentSettings.penelitian || !newDocumentSettings.pengabdian) {
        return new NextResponse(JSON.stringify({ message: 'Input tidak valid' }), { status: 400 });
    }

    try {
        await prisma.setting.upsert({
            where: { settingKey: 'document_settings' },
            update: { settingValue: newDocumentSettings },
            create: { settingKey: 'document_settings', settingValue: newDocumentSettings },
        });

        return NextResponse.json({ message: 'Pengaturan berkas berhasil diperbarui!' });

    } catch (error) {
        console.error("Gagal memperbarui pengaturan berkas:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}