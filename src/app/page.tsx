// src/app/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import MainApp from "@/components/MainApp";
import { authOptions } from "@/lib/auth";
import { AppState } from "@/types";
import prisma from "@/lib/prisma";

async function getInitialState(userId: string): Promise<AppState> {
  const [currentUser, users, programs, proposals, reviews, settingsResult] = await Promise.all([
    prisma.user.findUnique({ 
      where: { id: userId },
      include: {
        notifications: true,
      }
    }),
    prisma.user.findMany(),
    prisma.program.findMany(),
    prisma.proposal.findMany({
      include: {
        ketua: true,
        program: true,
        anggotaTim: { include: { user: true } },
        logbookEntries: true,
      },
      orderBy: { id: 'desc' }
    }),
    prisma.review.findMany(),
    prisma.setting.findMany(),
  ]);

  const settings = settingsResult.reduce((acc, setting) => {
    (acc as any)[setting.settingKey] = setting.settingValue;
    return acc;
  }, {});

  if (!currentUser) {
    redirect("/login");
  }

  const typedProposals = proposals.map(p => ({
    ...p,
    anggotaTim: p.anggotaTim.map(m => ({
      user: m.user,
      statusPersetujuan: m.statusPersetujuan,
    }))
  }));

  return { 
    currentUser: currentUser as any, 
    users: users as any, 
    programs: programs as any, 
    proposals: typedProposals as any, 
    reviews: reviews as any,
    settings 
  };
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session || !(session.user as any)?.id) {
    redirect("/login");
  }
  
  const initialState = await getInitialState((session.user as any).id);
  
  return (
    <main>
      <MainApp initialState={initialState} />
    </main>
  );
}
