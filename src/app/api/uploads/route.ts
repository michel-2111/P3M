// src/app/api/uploads/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseServerClient'; // <-- PERUBAHAN PENTING
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user) {
        return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    try {
        const { fileName, proposalId } = await request.json();
        if (!fileName || !proposalId) {
            return new NextResponse(JSON.stringify({ message: "Nama file dan ID proposal diperlukan." }), { status: 400 });
        }
        
        const fileExtension = fileName.split('.').pop();
        const uniqueFileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `${user.id}/${proposalId}/${uniqueFileName}`;

        const { data, error } = await supabase.storage
            .from('dokumen-proposal')
            .createSignedUploadUrl(filePath);

        if (error) {
            throw error;
        }
        
        const { data: { publicUrl } } = supabase.storage
            .from('dokumen-proposal')
            .getPublicUrl(filePath);

        return NextResponse.json({ signedUrl: data.signedUrl, publicUrl });

    } catch (error) {
        console.error("UPLOAD_API_ERROR", error);
        return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}