// src/app/api/profile/change-password/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
        const currentUser = (session?.user as any);
        if (!currentUser?.id) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

    try {
        const body = await req.json();
        const { oldPassword, newPassword } = body;

        if (!oldPassword || !newPassword) {
        return NextResponse.json({ message: "Password lama dan baru dibutuhkan" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id: currentUser.id } });

        if (!user) {
        return new NextResponse("User not found", { status: 404 });
        }

        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
        return NextResponse.json({ message: "Password lama salah" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
        where: { id: currentUser.id },
        data: { password: hashedPassword },
        });

        return NextResponse.json({ message: "Password berhasil diperbarui." });

    } catch (error) {
        console.error("[CHANGE_PASSWORD_PATCH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}