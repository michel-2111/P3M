// src/app/api/proposals/[id]/status/route.ts
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

    const proposalId = parseInt(params.id, 10);
    const { action } = await request.json();

    try {
        const proposal = await prisma.proposal.findUnique({
            where: { id: proposalId },
            include: { anggotaTim: true, ketua: true }
        });

        if (!proposal) {
            return new NextResponse(JSON.stringify({ message: "Proposal tidak ditemukan" }), { status: 404 });
        }

        switch (action) {
        case 'approve_title':
            await prisma.proposal.update({ where: { id: proposalId }, data: { status: 'Menunggu Persetujuan Anggota' } });
            const memberNotifications = proposal.anggotaTim.map(member => ({
                userId: member.userId,
                pesan: `Anda diundang oleh ${proposal.ketua.namaLengkap} untuk bergabung dalam proposal "${proposal.judul}".`,
                link: '/dashboard'
            }));
            if (memberNotifications.length > 0) {
                await prisma.notification.createMany({ data: memberNotifications });
            }
            break;

        case 'reject_title':
            await prisma.proposal.update({ where: { id: proposalId }, data: { status: 'Judul Ditolak' } });
            await prisma.notification.create({
                data: {
                    userId: proposal.userIdKetua,
                    pesan: `Judul proposal Anda "${proposal.judul}" ditolak oleh admin.`,
                    link: '/my_proposals'
                }
            });
            break;

        case 'approve_member':
            await prisma.proposalMember.update({
                where: { proposalId_userId: { proposalId: proposalId, userId: currentUser.id } },
                data: { statusPersetujuan: "Disetujui" },
            });

            const updatedProposal = await prisma.proposal.findUnique({
                where: { id: proposalId },
                include: { anggotaTim: true }
            });

            if (updatedProposal) {
                const allApproved = updatedProposal.anggotaTim.every(
                    (member) => member.statusPersetujuan === "Disetujui"
                );

                if (allApproved) {
                    await prisma.proposal.update({
                        where: { id: proposalId },
                        data: { status: "Menunggu Kelengkapan Dokumen" },
                    });

                    await prisma.notification.create({
                        data: {
                            userId: proposal.userIdKetua,
                            pesan: `Semua anggota tim telah menyetujui proposal "${proposal.judul}". Anda sekarang dapat melengkapi dokumen.`,
                            link: '/my_proposals'
                        }
                    });
                }
            }
            break;

        case 'submit_progress_report':
                if (proposal.userIdKetua !== currentUser.id) {
                    return new NextResponse(JSON.stringify({ message: "Akses ditolak" }), { status: 403 });
                }
                await prisma.proposal.update({
                    where: { id: proposalId },
                    data: { progressReportStatus: 'SUBMITTED' }
                });
                
                const adminsProgress = await prisma.user.findMany({ where: { peran: { array_contains: 'admin_p3m' } } });
                const notificationsProgress = adminsProgress.map(admin => ({
                    userId: admin.id,
                    pesan: `Laporan kemajuan untuk proposal "${proposal.judul}" telah diserahkan.`,
                    link: '/progress_monitoring',
                }));
                if (notificationsProgress.length > 0) {
                    await prisma.notification.createMany({ data: notificationsProgress });
                }
                break;
            
            case 'submit_final_report':
                if (proposal.userIdKetua !== currentUser.id) {
                    return new NextResponse(JSON.stringify({ message: "Akses ditolak" }), { status: 403 });
                }
                await prisma.proposal.update({
                    where: { id: proposalId },
                    data: { 
                        status: 'Menunggu Review Akhir',
                        finalReportStatus: 'SUBMITTED' 
                    }
                });
                
                const adminsFinal = await prisma.user.findMany({ where: { peran: { array_contains: 'admin_p3m' } } });
                const notificationsFinal = adminsFinal.map(admin => ({
                    userId: admin.id,
                    pesan: `Laporan akhir untuk proposal "${proposal.judul}" telah diserahkan.`,
                    link: '/final_report_monitoring',
                }));
                if (notificationsFinal.length > 0) {
                    await prisma.notification.createMany({ data: notificationsFinal });
                }
                break;

        default:
            return new NextResponse(JSON.stringify({ message: "Aksi tidak valid" }), { status: 400 });
        }

        if (action === 'approve_title' || action === 'reject_title') {
            const admins = await prisma.user.findMany({ where: { peran: { array_contains: ['admin_p3m'] } } });
            if (admins.length > 0) {
                await prisma.notification.deleteMany({
                    where: {
                        userId: { in: admins.map(a => a.id) },
                        pesan: `Proposal baru "${proposal.judul}" menunggu persetujuan judul.`
                    }
                });
            }
        } else if (action === 'approve_member') {
            await prisma.notification.deleteMany({
                where: {
                    userId: currentUser.id,
                    pesan: { contains: `untuk bergabung dalam proposal "${proposal.judul}"` }
                }
            });
        }

        return NextResponse.json({ message: "Status proposal berhasil diperbarui." });
    } catch (error) {
        console.error("STATUS_UPDATE_ERROR", error);
        return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
