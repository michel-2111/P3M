import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { namaLengkap, nidnNim, password } = body;

        if (!namaLengkap || !nidnNim || !password) {
        return new NextResponse(JSON.stringify({ message: "Data tidak lengkap" }), { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
        where: { nidnNim },
        });

        if (existingUser) {
            return new NextResponse(JSON.stringify({ message: "NIDN/NIM sudah terdaftar" }), { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const peran = nidnNim.length === 8 ? ["mahasiswa"] : ["dosen"];

    const user = await prisma.user.create({
        data: {
            namaLengkap,
            nidnNim,
            password: hashedPassword,
            peran,
        },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("REGISTRATION_ERROR", error);
        return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}