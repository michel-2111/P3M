// src/app/api/proposals/[id]/final-decision/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const proposalId = parseInt(params.id, 10);
  const { decision, reviewNotes } = await request.json();

  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
    });

    if (!proposal) {
      return new NextResponse(
        JSON.stringify({ message: "Proposal tidak ditemukan" }),
        { status: 404 }
      );
    }

    const updateData: Prisma.ProposalUpdateInput = {
      status: decision,
      detailProposal: {
        ...((proposal.detailProposal as any) || {}),
        catatanReviewer: reviewNotes,
      },
    };

    if (decision === "Didanai" || decision === "Ditolak") {
      updateData.decisionDate = new Date();
    }

    await prisma.proposal.update({
      where: { id: proposalId },
      data: updateData,
    });

    await prisma.notification.create({
      data: {
        userId: proposal.userIdKetua,
        pesan: `Status proposal "${proposal.judul}" telah diperbarui menjadi: ${decision}.`,
        link: "/my_proposals",
      },
    });

    return NextResponse.json({ message: "Keputusan akhir berhasil disimpan." });

  } catch (error) {
    console.error("FINAL_DECISION_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}