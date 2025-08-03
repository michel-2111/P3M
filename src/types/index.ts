// src/types/index.ts

export type Notification = {
    id: number;
    pesan: string;
    link: string;
    sudahDibaca: boolean;
};

export type User = {
    id: string;
    namaLengkap: string;
    nidnNim: string;
    peran: string[];
    notifications: Notification[];
};

export type Program = {
    id: string;
    namaProgram: string;
    kategori: string;
    deskripsi: string;
    detailLainnya: any;
};

export type ProposalMember = {
    user: User;
    statusPersetujuan: string;
}

export type OutputProgressItem = {
    status: string;
    fileName?: string;
    fileUrl?: string;
    publicationUrl?: string;
};

export type Proposal = {
    kategori: string;
    id: number;
    judul: string;
    abstrak: string;
    status: string;
    detailProposal: any;
    dokumenDiunggah: any;
    programId: string;
    userIdKetua: string;
    ketua: User;
    program: Program;
    anggotaTim: ProposalMember[];
    logbookEntries: any[];
    luaranWajibProgress?: { [key: number]: OutputProgressItem };
    luaranTambahanProgress?: { [key: number]: OutputProgressItem };
    progressReportStatus?: string | null;
    finalReportStatus?: string | null;

};

export type ReviewType = 'SUBSTANCE' | 'OUTPUT_KEMAJUAN' | 'OUTPUT_AKHIR';

export type Review = {
    totalSkor: number;
    id: number;
    proposalId: number;
    reviewerId: string;
    type: ReviewType;
    skor?: any;
    rekomendasi?: string | null;
    catatan?: string | null;
};

export type DocumentSettingItem = {
    id: string;
    name: string;
    isRequired: boolean;
};

export type ProposalDetailField = {
    id: string;
    key: string;
    label: string;
    type: 'textarea';
    isRequired: boolean;
};

export type Period = {
    start: string;
    end: string;
};

export type Setting = {
    schedules: {
        proposalPeriod: Period;
        luaranPeriod: Period;
        substanceReviewPeriod?: Period;
        progressReviewPeriod?: Period;
        finalReviewPeriod?: Period;
    };
    assessment_criteria: any;
    document_settings: {
        penelitian: DocumentSettingItem[];
        pengabdian: DocumentSettingItem[];
    };
    proposal_details: {
        penelitian: ProposalDetailField[];
        pengabdian: ProposalDetailField[];
    };
};

export type FinalDecision = 'Didanai' | 'Ditolak' | 'Perlu Revisi' | 'Selesai' | 'Gagal Validasi';

export type AppState = {
    currentUser: User;
    users: User[];
    programs: Program[];
    proposals: Proposal[];
    reviews: Review[];
    settings: any;
};