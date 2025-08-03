// src/app/api/users/[id]/roles/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
    ) {
    const session = await getServerSession(authOptions);
    const adminUser = session?.user as any;

    if (!adminUser || !adminUser.peran?.includes('admin_p3m')) {
        return new NextResponse(JSON.stringify({ message: 'Akses ditolak' }), { status: 403 });
    }

    const resolvedParams = await params;
    const userIdToUpdate = resolvedParams.id;
    const { peran } = await request.json();

    if (!userIdToUpdate || !Array.isArray(peran)) {
        return new NextResponse(JSON.stringify({ message: 'Input tidak valid' }), { status: 400 });
    }

    try {
        const updatedUser = await prisma.user.update({
        where: {
            id: userIdToUpdate,
        },
        data: {
            peran: peran,
        },
        });

        return NextResponse.json(updatedUser);

    } catch (error) {
        console.error("Gagal memperbarui peran pengguna:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}