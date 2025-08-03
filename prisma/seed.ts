// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Hashing passwords
    const adminPassword = await bcrypt.hash('a1234', 10);
    const dosen1Password = await bcrypt.hash('p1234', 10);
    const dosen2Password = await bcrypt.hash('p1234', 10);
    const dosen3Password = await bcrypt.hash('p1234', 10);
    const dosen4Password = await bcrypt.hash('p1234', 10);
    const mhs1Password = await bcrypt.hash('p1234', 10);
    const mhs2Password = await bcrypt.hash('p1234', 10);
    const mhs3Password = await bcrypt.hash('p1234', 10);
    const mhs4Password = await bcrypt.hash('p1234', 10);
    const mhs5Password = await bcrypt.hash('p1234', 10);

    await prisma.user.createMany({
        data: [
        { id: 'admin-1', namaLengkap: 'Admin P3M', nidnNim: 'ADMINP3M', password: adminPassword, peran: ['admin_p3m'] },
        { id: 'dosen-1', namaLengkap: 'Dr. Rilva Rumbayan, ST M.Eng', nidnNim: '197906022002122001', password: dosen1Password, peran: ['dosen', 'reviewer'] },
        { id: 'dosen-2', namaLengkap: 'Dra. Maryke Alelo, MBA', nidnNim: '196412131991032001', password: dosen2Password, peran: ['dosen'] },
        { id: 'dosen-3', namaLengkap: 'Prof. Trio Lonan, M.Kom', nidnNim: '197209011998031006', password: dosen3Password, peran: ['dosen', 'reviewer'] },
        { id: 'dosen-4', namaLengkap: 'Maksy Sendiang', nidnNim: '197405232002121004', password: dosen4Password, peran: ['dosen', 'reviewer'] },
        { id: 'mahasiswa-1', namaLengkap: 'Andi Pratama', nidnNim: '22013001', password: mhs1Password, peran: ['mahasiswa'] },
        { id: 'mahasiswa-2', namaLengkap: 'Citra Kirana', nidnNim: '22021015', password: mhs2Password, peran: ['mahasiswa'] },
        { id: 'mahasiswa-3', namaLengkap: 'Budi Santoso', nidnNim: '22031005', password: mhs3Password, peran: ['mahasiswa'] },
        { id: 'mahasiswa-4', namaLengkap: 'Michel Palar', nidnNim: '22024119', password: mhs4Password, peran: ['mahasiswa'] },
        { id: 'mahasiswa-5', namaLengkap: 'Harry Kountur', nidnNim: '22024118', password: mhs5Password, peran: ['mahasiswa'] },
        ],
        skipDuplicates: true,
    });
    console.log('Users seeded.');

    const pkmPrograms = [
        { id: 'PDPV', kategori: 'Penelitian', namaProgram: 'Penelitian Dasar Produk Vokasi', deskripsi: 'Skema ini menekankan pada luaran penelitian berupa publikasi ilmiah dan bertujuan membina kemampuan penelitian dosen pemula. Terbuka untuk semua bidang ilmu di Polimdo.', detailLainnya: { funding: '12500000', tkt: '1-3', outputs: ['Laporan akhir (softcopy dan hardcopy)', 'Publikasi ilmiah pada prosiding seminar nasional ber-ISSN atau jurnal lokal/nasional terakreditasi minimal SINTA 6.', 'Presentasi pada seminar hasil.'], goals: ['Meningkatkan jumlah dosen Polimdo yang melakukan penelitian produk vokasi TKT 1-3.', 'Meningkatkan jumlah dan kualitas publikasi dosen Polimdo.'], criteria: { team: { min: 4, max: 4 }, students: 2, sintaScore: 'Teknik: 50, Sosial: 25' }, allowedRoles: ['dosen'] } },
        { id: 'PPVUPS', kategori: 'Penelitian', namaProgram: 'Penelitian Produk Vokasi Unggulan Program Studi', deskripsi: 'Penelitian terapan yang bekerja sama dengan industri/stakeholder sesuai dengan roadmap prodi untuk menghasilkan teknologi pada TKT level 4-5.', detailLainnya: { funding: '25000000', tkt: '4-5', goals: ['Meningkatkan kerjasama industri/stakeholder dan memperkuat Program studi.', 'Mengembangkan penelitian sesuai kebutuhan industri.', 'Meningkatkan peranan Program Studi dalam mengembangkan keahlian dosen dan mahasiswa.', 'Menciptakan iklim akademik yang lebih dinamis dan kondusif.'], outputs: ['Laporan penelitian', 'Produk/model/software', 'Publikasi di prosiding/jurnal internasional bereputasi (Scopus/DOAJ/IEEE/WoS).', 'Skripsi/Tugas Akhir Mahasiswa.', 'Dokumen uji coba produk atau berita acara penggunaan produk oleh mitra.'], criteria: { team: { min: 4, max: 6 }, students: 3, sintaScore: 'Teknik: 75, Sosial: 50' }, allowedRoles: ['dosen'] } },
        { id: 'PPVUPT', kategori: 'Penelitian', namaProgram: 'Penelitian Produk Vokasi Unggulan Perguruan Tinggi', deskripsi: 'Penelitian untuk menghasilkan inovasi teknologi pada bidang-bidang unggulan dan rekayasa sosial (TKT 4-6) guna meningkatkan pembangunan berkelanjutan.', detailLainnya: { funding: '50000000', tkt: '4-6', goals: ['Mendorong percepatan capaian renstra penelitian institusi.', 'Mensinergikan penelitian terapan dengan kebijakan pembangunan.', 'Menjawab tantangan kebutuhan iptek-sosbud oleh pengguna sektor riil.', 'Membangun jejaring kerja sama antar peneliti.'], outputs: ['Laporan akhir', 'Prototipe/sistem/kebijakan atau model strategis.', 'KI paten sederhana (minimal status terdaftar).', 'Proceeding/jurnal internasional bereputasi (Scopus/DOAJ/IEEE/WoS).', '1 Skripsi/TA atau 1 publikasi mahasiswa pengganti.', 'Dokumen uji coba produk oleh mitra.'], criteria: { team: { min: 4, max: 10 }, students: 5, sintaScore: 'Teknik: 100, Sosial: 75' }, allowedRoles: ['dosen'] } },
        { id: 'PPI', kategori: 'Penelitian', namaProgram: 'Penelitian Penugasan Institusi', deskripsi: 'Penelitian yang ditugaskan oleh Direktur untuk mendukung program peningkatan kapasitas institusi dan kerja sama dengan industri, mengacu pada Renstra Penelitian Polimdo.', detailLainnya: { funding: '50000000', tkt: '4-6', goals: ['Menguatkan kerjasama penelitian antar jurusan dan industri.', 'Menghasilkan teknologi tepat guna/prototipe/produk/model yang siap diterapkan.'], outputs: ['Laporan akhir', 'Prosiding/jurnal internasional bereputasi (Scopus/DOAJ/IEEE/WoS).', 'Paten sederhana minimal terdaftar atau Prosiding/Jurnal Internasional terindeks.', 'Dokumen uji coba produk atau berita acara serah terima.'], criteria: { team: { min: 4, max: 10 }, students: 5, sintaScore: 'Teknik: 100, Sosial: 75' }, allowedRoles: ['dosen'] } },
        { id: 'PKM', kategori: 'Penelitian', namaProgram: 'Penelitian Kreativitas Mahasiswa', deskripsi: 'Program pembinaan penalaran bagi mahasiswa sarjana terapan untuk memperoleh kompetensi penelitian sesuai bidang ilmu yang ditekuni.', detailLainnya: { funding: '5000000', tkt: 'N/A', goals: ['Memberikan pengalaman kepada mahasiswa untuk memperoleh kompetensi penelitian.', 'Mengimplementasikan konsep dan teori dari perkuliahan.', 'Menghasilkan material, piranti, sistem, atau metode yang lebih efektif dan efisien.'], outputs: ['Laporan penelitian (softcopy dan hardcopy)', 'Artikel ilmiah di Prosiding Seminar Nasional ber-ISSN atau Jurnal Nasional Terakreditasi minimal SINTA 6.', 'Presentasi pada seminar hasil.'], criteria: { team: { min: 4, max: 4 }, students: 4, sintaScore: 'N/A' }, allowedRoles: ['mahasiswa'] } },
        { id: 'PM', kategori: 'Penelitian', namaProgram: 'Penelitian Mandiri', deskripsi: 'Memfasilitasi kegiatan penelitian dosen dengan sumber dana pribadi untuk menghasilkan teori baru, produk, proses, atau model untuk menyelesaikan masalah nyata.', detailLainnya: { funding: '0', tkt: 'N/A', goals: ['Mewadahi kreativitas dosen dalam menentukan tema dan output penelitian mandiri.', 'Meningkatkan kompetensi dosen dalam menghasilkan luaran penelitian yang bermanfaat.'], outputs: ['Laporan akhir (softcopy dan hardcopy)', 'Publikasi ilmiah di prosiding/jurnal (lokal/nasional/internasional) atau kekayaan intelektual.'], criteria: { team: { min: 4, max: 10 }, students: 0, sintaScore: 'N/A' }, allowedRoles: ['dosen'] } },
        { id: 'PBM', kategori: 'Pengabdian', namaProgram: 'Program Pengabdian Berbasis Masyarakat', deskripsi: 'Program pengabdian yang bersifat problem solving, komprehensif, dan berkelanjutan dengan sasaran masyarakat produktif, calon wirausahawan, atau masyarakat umum.', detailLainnya: { funding: '10000000', tkt: 'N/A', goals: ['Membentuk/mengembangkan sekelompok masyarakat yang mandiri secara ekonomi.', 'Membantu menciptakan ketentraman, dan kenyamanan dalam kehidupan bermasyarakat.', 'Meningkatkan keterampilan berpikir, membaca dan menulis atau keterampilan lain yang dibutuhkan (softskill dan hardskill).'], outputs: ['Satu artikel ilmiah di Jurnal ber-ISSN atau prosiding seminar nasional, atau publikasi media massa.', 'Peningkatan daya saing mitra.', 'Peningkatan penerapan IPTEK di masyarakat.', 'Perbaikan tata nilai masyarakat (diuraikan pada poster digital).', 'Video kegiatan di YouTube P3M Polimdo.', 'Poster Digital.'], criteria: { team: { min: 4, max: 10 }, students: 5, sintaScore: 'Teknik: 50, Sosial: 25' }, allowedRoles: ['dosen'] } },
        { id: 'PPIV', kategori: 'Pengabdian', namaProgram: 'Penerapan Produk Inovasi Vokasi', deskripsi: 'Memfasilitasi proses hilirisasi produk teknologi hasil penelitian dan pengembangan ke masyarakat melalui pemberdayaan untuk meningkatkan produktivitas dan kesejahteraan.', detailLainnya: { funding: '20000000', tkt: 'N/A', goals: ['Memfasilitasi hilirisasi produk teknologi ke masyarakat.', 'Meningkatkan sinergi kelembagaan IPTEK.', 'Meningkatkan produktivitas, nilai tambah, dan daya saing produk berbasis IPTEK.', 'Membentuk jaringan antara institusi, penghasil teknologi, dan pengguna.', 'Meningkatkan kesejahteraan masyarakat.'], outputs: ['Produk teknologi yang dimanfaatkan oleh masyarakat.', 'Artikel pada Jurnal Pengabdian Kepada Masyarakat (accepted/published).', 'Publikasi media massa.', 'Video kegiatan di YouTube P3M Polimdo.', 'Poster Digital.', 'Surat keterangan pemanfaatan produk oleh mitra.'], criteria: { team: { min: 4, max: 10 }, students: 5, sintaScore: 'Teknik: 75, Sosial: 50' }, allowedRoles: ['dosen'] } },
        { id: 'PBM-M', kategori: 'Pengabdian', namaProgram: 'Program Pengabdian Berbasis Masyarakat oleh Mahasiswa', deskripsi: 'Kegiatan lapangan wajib bagi mahasiswa untuk mendorong empati dan memberikan kontribusi nyata bagi penyelesaian persoalan di masyarakat, industri, dan pemerintah daerah.', detailLainnya: { funding: '10000000', tkt: 'N/A', goals: ['Menerapkan standar Pengabdian kepada Masyarakat.', 'Mengembangkan tema PBM-M yang inovatif dan kreatif sesuai kompetensi jurusan.', 'Mengembangkan tema PBM-M yang bermitra dengan pemerintah, industri, dan dunia usaha.'], outputs: ['Peningkatan penerapan iptek di masyarakat.', 'Publikasi pada media massa.', 'Video kegiatan di YouTube P3M Polimdo.', 'Poster Digital.', 'Peningkatan kedisiplinan dan partisipasi mahasiswa.', 'Surat keterangan pemanfaatan hasil pengabdian oleh mitra.'], criteria: { team: { min: 11, max: 20 }, students: 10, sintaScore: 'Teknik: 50, Sosial: 25' }, allowedRoles: ['dosen'] } },
    ];

    for (const program of pkmPrograms) {
        await prisma.program.upsert({
        where: { id: program.id },
        update: {},
        create: program as any,
        });
    }
    console.log('Programs seeded.');
    
    const proposal1 = await prisma.proposal.create({
        data: {
        programId: 'PDPV',
        judul: 'Analisis Sentimen Kebijakan Transportasi',
        abstrak: 'Abstrak...',
        status: 'Menunggu Kelengkapan Dokumen',
        userIdKetua: 'dosen-1',
        detailProposal: { tkt: 2, luaranTambahan: ['Buku ajar ber-ISBN'], catatanReviewer: [] },
        dokumenDiunggah: {},
        }
    });
    await prisma.proposalMember.create({
        data: {
        proposalId: proposal1.id,
        userId: 'dosen-3',
        statusPersetujuan: 'Disetujui',
        }
    });
    console.log('Proposals seeded.');

    const initialAssessmentCriteria = {
    penelitian: {
        'PDPV': {
        title: 'Penilaian Substansi Proposal Penelitian Dasar Produk Vokasi',
        maxScore: 400,
        groups: [
            { name: 'Rekam Jejak', weight: 8, items: [
            { key: 'publikasi', label: 'Publikasi, kekayaan intelektual, buku ketua pengusul yang disitasi pada proposal', weight: 4, options: [{text: "0", score: 1}, {text: "1", score: 2}, {text: "2-4", score: 3}, {text: ">=5", score: 4}] },
            { key: 'relevansi', label: 'Relevansi kepakaran pengusul dengan tema proposal', weight: 4, options: [{text: "Tidak Relevan", score: 1}, {text: "Kurang Relevan", score: 2}, {text: "Relevan", score: 4}] },
            ]},
            { name: 'Urgensi Penelitian', weight: 57, items: [
            { key: 'rumusanMasalah', label: 'Ketajaman perumusan masalah', weight: 15, options: [{text: "Tidak Tajam", score: 1}, {text: "Kurang Tajam", score: 2}, {text: "Tajam", score: 4}] },
            { key: 'inovasi', label: 'Inovasi pendekatan pemecahan masalah', weight: 15, options: [{text: "Tidak Inovatif", score: 1}, {text: "Kurang Inovatif", score: 2}, {text: "Inovatif", score: 4}] },
            { key: 'kebaharuan', label: 'State of the art dan kebaharuan: menggunakan pendekatan baru', weight: 12, options: [{text: "Banyak penelitian serupa", score: 1}, {text: "Penelitian belum banyak dilakukan", score: 2}, {text: "Menggunakan pendekatan baru", score: 4}] },
            { key: 'roadmap', label: 'Akurasi peta jalan (roadmap) penelitian', weight: 15, options: [{text: "Tidak ada roadmap", score: 1}, {text: "Roadmap tidak jelas", score: 2}, {text: "Roadmap jelas, tidak ada penelitian sebelumnya", score: 3}, {text: "Roadmap jelas dan terkait", score: 4}] },
            ]},
            { name: 'Metode', weight: 25, items: [
            { key: 'akurasiMetode', label: 'Akurasi metode penelitian', weight: 10, options: [{text: "Tidak Akurat", score: 1}, {text: "Kurang Akurat", score: 2}, {text: "Akurat", score: 4}] },
            { key: 'pembagianTugas', label: 'Kejelasan pembagian tugas tim peneliti', weight: 5, options: [{text: "Tidak ada", score: 1}, {text: "Tidak Jelas", score: 2}, {text: "Jelas tapi tidak sesuai", score: 3}, {text: "Jelas dan sesuai", score: 4}] },
            { key: 'kesesuaianMetode', label: 'Kesesuaian metode dengan waktu, luaran dan fasilitas', weight: 10, options: [{text: "Tidak Sinkron", score: 1}, {text: "Kurang Sinkron", score: 2}, {text: "Sinkron", score: 4}] },
            ]},
            { name: 'Referensi', weight: 10, items: [
            { key: 'kebaharuanReferensi', label: 'Kebaharuan referensi: pustaka primer dan mutakhir > 80%', weight: 5, options: [{text: "Tidak ada pustaka primer", score: 1}, {text: "< 50%", score: 2}, {text: "51-80%", score: 3}, {text: "> 80%", score: 4}] },
            { key: 'relevansiReferensi', label: 'Relevansi dan kualitas referensi', weight: 5, options: [{text: "Tidak Relevan", score: 1}, {text: "Kurang Relevan", score: 2}, {text: "Relevan, jurnal tidak terakreditasi", score: 3}, {text: "Relevan, jurnal terakreditasi", score: 4}] },
            ]},
        ]
        },
        'PKM': {
        title: 'Penilaian Substansi Proposal Penelitian Kreativitas Mahasiswa',
        maxScore: 400,
        groups: [
            { name: 'Urgensi Penelitian', weight: 30, items: [
            { key: 'rumusanMasalah', label: 'Ketajaman perumusan masalah', weight: 10, options: [{text: "Tidak Tajam", score: 1}, {text: "Kurang Tajam", score: 2}, {text: "Tajam", score: 4}] },
            { key: 'inovasi', label: 'Inovasi pendekatan pemecahan masalah', weight: 10, options: [{text: "Tidak Inovatif", score: 1}, {text: "Kurang Inovatif", score: 2}, {text: "Inovatif", score: 4}] },
            { key: 'kebaharuan', label: 'State of the art dan kebaharuan', weight: 10, options: [{text: "Banyak penelitian serupa", score: 1}, {text: "Penelitian belum banyak dilakukan", score: 2}, {text: "Menggunakan pendekatan baru", score: 4}] },
            ]},
            { name: 'Metode', weight: 50, items: [
            { key: 'roadmap', label: 'Akurasi peta jalan (roadmap) penelitian', weight: 15, options: [{text: "Tidak ada roadmap", score: 1}, {text: "Roadmap tidak jelas", score: 2}, {text: "Roadmap jelas, tidak ada penelitian sebelumnya", score: 3}, {text: "Roadmap jelas dan terkait", score: 4}] },
            { key: 'akurasiMetode', label: 'Akurasi metode penelitian', weight: 15, options: [{text: "Tidak Akurat", score: 1}, {text: "Kurang Akurat", score: 2}, {text: "Akurat", score: 4}] },
            { key: 'pembagianTugas', label: 'Kejelasan pembagian tugas tim peneliti', weight: 10, options: [{text: "Tidak ada", score: 1}, {text: "Tidak Jelas", score: 2}, {text: "Jelas tapi tidak sesuai", score: 3}, {text: "Jelas dan sesuai", score: 4}] },
            { key: 'kesesuaianMetode', label: 'Kesesuaian metode dengan waktu, luaran dan fasilitas', weight: 10, options: [{text: "Tidak Sinkron", score: 1}, {text: "Kurang Sinkron", score: 2}, {text: "Sinkron", score: 4}] },
            ]},
            { name: 'Referensi', weight: 20, items: [
            { key: 'kebaharuanReferensi', label: 'Kebaharuan referensi (>80% primer & mutakhir)', weight: 10, options: [{text: "Tidak ada pustaka primer", score: 1}, {text: "< 50%", score: 2}, {text: "51-80%", score: 3}, {text: "> 80%", score: 4}] },
            { key: 'relevansiReferensi', label: 'Relevansi dan kualitas referensi', weight: 10, options: [{text: "Tidak Relevan", score: 1}, {text: "Kurang Relevan", score: 2}, {text: "Relevan, jurnal tidak terakreditasi", score: 3}, {text: "Relevan, jurnal terakreditasi", score: 4}] },
            ]},
        ]
        },
        'PPVUPS': {
        title: 'Penilaian Substansi Proposal Penelitian Produk Vokasi Unggulan Program Studi',
        maxScore: 400,
        groups: [
            { name: 'Rekam Jejak', weight: 20, items: [
            { key: 'publikasi', label: 'Publikasi, kekayaan intelektual, buku ketua pengusul', weight: 10, options: [{text: "0", score: 1}, {text: "1", score: 2}, {text: "2-4", score: 3}, {text: ">=5", score: 4}] },
            { key: 'relevansi', label: 'Relevansi kepakaran pengusul dengan tema proposal', weight: 10, options: [{text: "Tidak Relevan", score: 1}, {text: "Kurang Relevan", score: 2}, {text: "Relevan", score: 4}] },
            ]},
            { name: 'Urgensi Penelitian', weight: 35, items: [
            { key: 'rumusanMasalah', label: 'Ketajaman perumusan masalah', weight: 10, options: [{text: "Tidak Tajam", score: 1}, {text: "Kurang Tajam", score: 2}, {text: "Tajam", score: 4}] },
            { key: 'inovasi', label: 'Inovasi pendekatan pemecahan masalah', weight: 10, options: [{text: "Tidak Inovatif", score: 1}, {text: "Kurang Inovatif", score: 2}, {text: "Inovatif", score: 4}] },
            { key: 'kebaharuan', label: 'State of the art dan kebaharuan', weight: 10, options: [{text: "Banyak penelitian serupa", score: 1}, {text: "Penelitian belum banyak dilakukan", score: 2}, {text: "Menggunakan pendekatan baru", score: 4}] },
            { key: 'roadmap', label: 'Akurasi peta jalan (roadmap) penelitian', weight: 5, options: [{text: "Tidak ada roadmap", score: 1}, {text: "Roadmap tidak jelas", score: 2}, {text: "Roadmap jelas, tidak ada penelitian sebelumnya", score: 3}, {text: "Roadmap jelas dan terkait", score: 4}] },
            ]},
            { name: 'Metode', weight: 35, items: [
            { key: 'akurasiMetode', label: 'Akurasi metode penelitian', weight: 10, options: [{text: "Tidak Akurat", score: 1}, {text: "Kurang Akurat", score: 2}, {text: "Akurat", score: 4}] },
            { key: 'pembagianTugas', label: 'Kejelasan pembagian tugas tim peneliti', weight: 10, options: [{text: "Tidak ada", score: 1}, {text: "Tidak Jelas", score: 2}, {text: "Jelas tapi tidak sesuai", score: 3}, {text: "Jelas dan sesuai", score: 4}] },
            { key: 'kesesuaianMetode', label: 'Kesesuaian metode dengan waktu, luaran dan fasilitas', weight: 10, options: [{text: "Tidak Sinkron", score: 1}, {text: "Kurang Sinkron", score: 2}, {text: "Sinkron", score: 4}] },
            { key: 'mitra', label: 'Kredibilitas mitra dan bentuk dukungan', weight: 5, options: [{text: "Tidak ada mitra", score: 1}, {text: "Mitra kurang kredibel", score: 2}, {text: "Mitra kredibel, dukungan tidak signifikan", score: 3}, {text: "Mitra kredibel, dukungan signifikan", score: 4}] },
            ]},
            { name: 'Referensi', weight: 10, items: [
            { key: 'kebaharuanReferensi', label: 'Kebaharuan referensi (>80% primer & mutakhir)', weight: 5, options: [{text: "Tidak ada pustaka primer", score: 1}, {text: "< 50%", score: 2}, {text: "51-80%", score: 3}, {text: "> 80%", score: 4}] },
            { key: 'relevansiReferensi', label: 'Relevansi dan kualitas referensi', weight: 5, options: [{text: "Tidak Relevan", score: 1}, {text: "Kurang Relevan", score: 2}, {text: "Relevan, jurnal tidak terakreditasi", score: 3}, {text: "Relevan, jurnal terakreditasi", score: 4}] },
            ]},
        ]
        },
        'PPVUPT': {
        title: 'Penilaian Substansi Proposal Penelitian Produk Vokasi Unggulan Perguruan Tinggi',
        maxScore: 400,
        groups: [
            { name: 'Rekam Jejak', weight: 20, items: [ { key: 'publikasi', label: 'Publikasi, kekayaan intelektual, buku ketua pengusul', weight: 10, options: [{text: "0", score: 1}, {text: "1", score: 2}, {text: "2-4", score: 3}, {text: ">=5", score: 4}] }, { key: 'relevansi', label: 'Relevansi kepakaran pengusul dengan tema proposal', weight: 10, options: [{text: "Tidak Relevan", score: 1}, {text: "Kurang Relevan", score: 2}, {text: "Relevan", score: 4}] }, ]},
            { name: 'Urgensi Penelitian', weight: 35, items: [ { key: 'rumusanMasalah', label: 'Ketajaman perumusan masalah', weight: 10, options: [{text: "Tidak Tajam", score: 1}, {text: "Kurang Tajam", score: 2}, {text: "Tajam", score: 4}] }, { key: 'inovasi', label: 'Inovasi pendekatan pemecahan masalah', weight: 10, options: [{text: "Tidak Inovatif", score: 1}, {text: "Kurang Inovatif", score: 2}, {text: "Inovatif", score: 4}] }, { key: 'kebaharuan', label: 'State of the art dan kebaharuan', weight: 10, options: [{text: "Banyak penelitian serupa", score: 1}, {text: "Penelitian belum banyak dilakukan", score: 2}, {text: "Menggunakan pendekatan baru", score: 4}] }, { key: 'roadmap', label: 'Akurasi peta jalan (roadmap) penelitian', weight: 5, options: [{text: "Tidak ada roadmap", score: 1}, {text: "Roadmap tidak jelas", score: 2}, {text: "Roadmap jelas, tidak ada penelitian sebelumnya", score: 3}, {text: "Roadmap jelas dan terkait", score: 4}] }, ]},
            { name: 'Metode', weight: 35, items: [ { key: 'akurasiMetode', label: 'Akurasi metode penelitian', weight: 10, options: [{text: "Tidak Akurat", score: 1}, {text: "Kurang Akurat", score: 2}, {text: "Akurat", score: 4}] }, { key: 'pembagianTugas', label: 'Kejelasan pembagian tugas tim peneliti', weight: 10, options: [{text: "Tidak ada", score: 1}, {text: "Tidak Jelas", score: 2}, {text: "Jelas tapi tidak sesuai", score: 3}, {text: "Jelas dan sesuai", score: 4}] }, { key: 'kesesuaianMetode', label: 'Kesesuaian metode dengan waktu, luaran dan fasilitas', weight: 10, options: [{text: "Tidak Sinkron", score: 1}, {text: "Kurang Sinkron", score: 2}, {text: "Sinkron", score: 4}] }, { key: 'mitra', label: 'Kredibilitas mitra dan bentuk dukungan', weight: 5, options: [{text: "Tidak ada mitra", score: 1}, {text: "Mitra kurang kredibel", score: 2}, {text: "Mitra kredibel, dukungan tidak signifikan", score: 3}, {text: "Mitra kredibel, dukungan signifikan", score: 4}] }, ]},
            { name: 'Referensi', weight: 10, items: [ { key: 'kebaharuanReferensi', label: 'Kebaharuan referensi (>80% primer & mutakhir)', weight: 5, options: [{text: "Tidak ada pustaka primer", score: 1}, {text: "< 50%", score: 2}, {text: "51-80%", score: 3}, {text: "> 80%", score: 4}] }, { key: 'relevansiReferensi', label: 'Relevansi dan kualitas referensi', weight: 5, options: [{text: "Tidak Relevan", score: 1}, {text: "Kurang Relevan", score: 2}, {text: "Relevan, jurnal tidak terakreditasi", score: 3}, {text: "Relevan, jurnal terakreditasi", score: 4}] }, ]},
        ]
        },
        'PPI': {
        title: 'Penilaian Substansi Proposal Penelitian Penugasan Institusi',
        maxScore: 400,
        groups: [
            { name: 'Rekam Jejak', weight: 20, items: [ { key: 'publikasi', label: 'Publikasi, kekayaan intelektual, buku ketua pengusul', weight: 10, options: [{text: "0", score: 1}, {text: "1", score: 2}, {text: "2-4", score: 3}, {text: ">=5", score: 4}] }, { key: 'relevansi', label: 'Relevansi kepakaran pengusul dengan tema proposal', weight: 10, options: [{text: "Tidak Relevan", score: 1}, {text: "Kurang Relevan", score: 2}, {text: "Relevan", score: 4}] }, ]},
            { name: 'Urgensi Penelitian', weight: 35, items: [ { key: 'rumusanMasalah', label: 'Ketajaman perumusan masalah', weight: 10, options: [{text: "Tidak Tajam", score: 1}, {text: "Kurang Tajam", score: 2}, {text: "Tajam", score: 4}] }, { key: 'inovasi', label: 'Inovasi pendekatan pemecahan masalah', weight: 10, options: [{text: "Tidak Inovatif", score: 1}, {text: "Kurang Inovatif", score: 2}, {text: "Inovatif", score: 4}] }, { key: 'kebaharuan', label: 'State of the art dan kebaharuan', weight: 10, options: [{text: "Banyak penelitian serupa", score: 1}, {text: "Penelitian belum banyak dilakukan", score: 2}, {text: "Menggunakan pendekatan baru", score: 4}] }, { key: 'roadmap', label: 'Akurasi peta jalan (roadmap) penelitian', weight: 5, options: [{text: "Tidak ada roadmap", score: 1}, {text: "Roadmap tidak jelas", score: 2}, {text: "Roadmap jelas, tidak ada penelitian sebelumnya", score: 3}, {text: "Roadmap jelas dan terkait", score: 4}] }, ]},
            { name: 'Metode', weight: 35, items: [ { key: 'akurasiMetode', label: 'Akurasi metode penelitian', weight: 10, options: [{text: "Tidak Akurat", score: 1}, {text: "Kurang Akurat", score: 2}, {text: "Akurat", score: 4}] }, { key: 'pembagianTugas', label: 'Kejelasan pembagian tugas tim peneliti', weight: 10, options: [{text: "Tidak ada", score: 1}, {text: "Tidak Jelas", score: 2}, {text: "Jelas tapi tidak sesuai", score: 3}, {text: "Jelas dan sesuai", score: 4}] }, { key: 'kesesuaianMetode', label: 'Kesesuaian metode dengan waktu, luaran dan fasilitas', weight: 10, options: [{text: "Tidak Sinkron", score: 1}, {text: "Kurang Sinkron", score: 2}, {text: "Sinkron", score: 4}] }, { key: 'mitra', label: 'Kredibilitas mitra dan bentuk dukungan', weight: 5, options: [{text: "Tidak ada mitra", score: 1}, {text: "Mitra kurang kredibel", score: 2}, {text: "Mitra kredibel, dukungan tidak signifikan", score: 3}, {text: "Mitra kredibel, dukungan signifikan", score: 4}] }, ]},
            { name: 'Referensi', weight: 10, items: [ { key: 'kebaharuanReferensi', label: 'Kebaharuan referensi (>80% primer & mutakhir)', weight: 5, options: [{text: "Tidak ada pustaka primer", score: 1}, {text: "< 50%", score: 2}, {text: "51-80%", score: 3}, {text: "> 80%", score: 4}] }, { key: 'relevansiReferensi', label: 'Relevansi dan kualitas referensi', weight: 5, options: [{text: "Tidak Relevan", score: 1}, {text: "Kurang Relevan", score: 2}, {text: "Relevan, jurnal tidak terakreditasi", score: 3}, {text: "Relevan, jurnal terakreditasi", score: 4}] }, ]},
        ]
        }
    },
    pengabdian: {
        'PBM': [ { title: "REKAM JEJAK", maxScore: 20, components: [ { name: "Kualitas dan Kuantitas Publikasi Artikel di Jurnal Ilmiah", options: [ { text: "Ketua pengusul memiliki publikasi berupa artikel di jurnal ilmiah terakreditasi SINTA sebagai penulis pertama atau corresponding author kurang dari 3 artikel", score: 5 }, { text: "Ketua pengusul memiliki publikasi berupa artikel di jurnal ilmiah terakreditasi SINTA sebagai penulis pertama atau corresponding author sebanyak 3-5 artikel", score: 10 }, { text: "Ketua pengusul memiliki publikasi berupa artikel di jurnal ilmiah terakreditasi SINTA sebagai penulis pertama atau corresponding author sebanyak 6-10 artikel", score: 15 }, { text: "Ketua pengusul memiliki publikasi berupa artikel di jurnal ilmiah terakreditasi SINTA sebagai penulis pertama atau corresponding author sebanyak > 10 artikel", score: 20 }, ] } ] }, { title: "SUBSTANSI", maxScore: 380, components: [ { name: "Penjelasan kondisi eksisting mitra seperti profil, potensi masyarakat dan wilayah", options: [ { text: "Tidak lengkap dan tidak jelas", score: 0 }, { text: "Tidak lengkap namun cukup jelas / lengkap namun tidak jelas", score: 10 }, { text: "Lengkap dan jelas", score: 20 }, { text: "Lengkap, jelas, dan runtut", score: 25 } ] }, { name: "Ketajaman analisis situasi permasalahan mitra sasaran", options: [ { text: "Tidak jelas", score: 0 }, { text: "Cukup jelas", score: 10 }, { text: "Jelas", score: 20 }, { text: "Sangat jelas", score: 25 } ] }, { name: "Rumusan masalah prioritas minimal 2 bidang permasalahan", options: [ { text: "Tidak jelas", score: 0 }, { text: "Cukup jelas", score: 10 }, { text: "Jelas", score: 20 }, { text: "Sangat jelas", score: 25 } ] }, { name: "Kesesuaian solusi dengan permasalahan Mitra", options: [ { text: "Tidak sesuai", score: 0 }, { text: "Kurang sesuai", score: 10 }, { text: "Sesuai", score: 20 }, { text: "Sangat sesuai", score: 30 } ] }, { name: "Metode dan rencana kegiatan yang ditawarkan", options: [ { text: "Tidak sesuai", score: 0 }, { text: "Kurang sesuai", score: 10 }, { text: "Sesuai", score: 20 }, { text: "Sesuai dan dapat berkelanjutan", score: 30 } ] }, { name: "Pelaksanaan pengabdian dan metode penyelesaian masalah", options: [ { text: "Tidak menggambarkan 5 tahapan", score: 0 }, { text: "Kurang menggambarkan 5 tahapan", score: 10 }, { text: "Telah menggambarkan 5 tahapan", score: 20 }, { text: "Telah menggambarkan 5 tahapan, jelas dan rasional", score: 30 } ] }, { name: "Partisipasi mitra sasaran", options: [ { text: "Tidak melibatkan partisipasi", score: 0 }, { text: "Kurang melibatkan partisipasi", score: 10 }, { text: "Telah melibatkan partisipasi", score: 20 } ] }, { name: "Kesesuaian penugasan, kompetensi tim pelaksana dan mahasiswa", options: [ { text: "Tidak sesuai", score: 0 }, { text: "Kurang sesuai", score: 10 }, { text: "Sesuai", score: 15 }, { text: "Sangat sesuai", score: 20 } ] }, { name: "Kualitas Ipteks yang ditawarkan (hasil penelitian)", options: [ { text: "Kurang baik dan/atau tidak sesuai", score: 0 }, { text: "Cukup baik namun kurang sesuai", score: 10 }, { text: "Baik namun masih kurang sesuai", score: 20 }, { text: "Baik, sesuai, dan merupakan hasil penelitian Pengusul", score: 30 } ] }, { name: "Implementasi/Penerapan Teknologi dan Inovasi", options: [ { text: "Bukan dari hasil penelitian dan tidak jelas", score: 0 }, { text: "Bukan dari hasil penelitian namun cukup jelas", score: 10 }, { text: "Bukan dari hasil penelitian namun sangat jelas", score: 20 }, { text: "Merupakan hasil penelitian pelaksana dan jelas", score: 30 } ] }, { name: "Kewajaran tahapan target capaian luaran wajib", options: [ { text: "Tidak rasional/tidak jelas", score: 0 }, { text: "Kurang jelas", score: 10 }, { text: "Jelas", score: 15 }, { text: "Sangat jelas", score: 20 } ] }, { name: "Kesesuaian jadwal", options: [ { text: "Tidak sesuai/kurang sesuai", score: 0 }, { text: "Sesuai dengan tahapan dan waktu", score: 20 } ] }, { name: "Rencana Anggaran Biaya", options: [ { text: "Tidak sesuai ketentuan/tidak rasional", score: 0 }, { text: "Beberapa komponen belum rasional", score: 10 }, { text: "Cukup rasional dan sesuai HPS", score: 20 } ] }, { name: "Rencana Peningkatan level keberdayaan Mitra", options: [ { text: "Tidak sesuai dengan permasalahan", score: 0 }, { text: "Sesuai namun tidak terkuantifikasi", score: 15 }, { text: "Sesuai dan terkuantifikasi", score: 25 } ] }, { name: "Artikel ilmiah (Jurnal/Prosiding)", options: [ { text: "Tidak ada/tidak sesuai ketentuan", score: 0 }, { text: "Ada link namun tidak sesuai", score: 10 }, { text: "Ada link dan sesuai ketentuan", score: 20 } ] }, { name: "Video kegiatan", options: [ { text: "Tidak ada link/bukan YouTube lembaga", score: 0 }, { text: "Ada link YouTube lembaga", score: 10 } ] }, ] } ],
        'PPIV': [ { title: "REKAM JEJAK", maxScore: 20, components: [ { name: "Kualitas dan Kuantitas Publikasi Artikel di Jurnal Ilmiah", options: [ { text: "Ketua pengusul memiliki publikasi berupa artikel di jurnal ilmiah terakreditasi SINTA sebagai penulis pertama atau corresponding author kurang dari 3 artikel", score: 5 }, { text: "Ketua pengusul memiliki publikasi berupa artikel di jurnal ilmiah terakreditasi SINTA sebagai penulis pertama atau corresponding author sebanyak 3-5 artikel", score: 10 }, { text: "Ketua pengusul memiliki publikasi berupa artikel di jurnal ilmiah terakreditasi SINTA sebagai penulis pertama atau corresponding author sebanyak 6-10 artikel", score: 15 }, { text: "Ketua pengusul memiliki publikasi berupa artikel di jurnal ilmiah terakreditasi SINTA sebagai penulis pertama atau corresponding author sebanyak > 10 artikel", score: 20 }, ] } ] }, { title: "SUBSTANSI", maxScore: 380, components: [ { name: "Penjelasan kondisi eksisting mitra seperti profil, potensi masyarakat dan wilayah", options: [ { text: "Tidak lengkap dan tidak jelas", score: 0 }, { text: "Tidak lengkap namun cukup jelas / lengkap namun tidak jelas", score: 10 }, { text: "Lengkap dan jelas", score: 20 }, { text: "Lengkap, jelas, dan runtut", score: 25 } ] }, { name: "Ketajaman analisis situasi permasalahan mitra sasaran", options: [ { text: "Tidak jelas", score: 0 }, { text: "Cukup jelas", score: 10 }, { text: "Jelas", score: 20 }, { text: "Sangat jelas", score: 25 } ] }, { name: "Rumusan masalah prioritas minimal 2 bidang permasalahan", options: [ { text: "Tidak jelas", score: 0 }, { text: "Cukup jelas", score: 10 }, { text: "Jelas", score: 20 }, { text: "Sangat jelas", score: 25 } ] }, { name: "Kesesuaian solusi dengan permasalahan Mitra", options: [ { text: "Tidak sesuai", score: 0 }, { text: "Kurang sesuai", score: 10 }, { text: "Sesuai", score: 20 }, { text: "Sangat sesuai", score: 30 } ] }, { name: "Metode dan rencana kegiatan yang ditawarkan", options: [ { text: "Tidak sesuai", score: 0 }, { text: "Kurang sesuai", score: 10 }, { text: "Sesuai", score: 20 }, { text: "Sesuai dan dapat berkelanjutan", score: 30 } ] }, { name: "Pelaksanaan pengabdian dan metode penyelesaian masalah", options: [ { text: "Tidak menggambarkan 5 tahapan", score: 0 }, { text: "Kurang menggambarkan 5 tahapan", score: 10 }, { text: "Telah menggambarkan 5 tahapan", score: 20 }, { text: "Telah menggambarkan 5 tahapan, jelas dan rasional", score: 30 } ] }, { name: "Partisipasi mitra sasaran", options: [ { text: "Tidak melibatkan partisipasi", score: 0 }, { text: "Kurang melibatkan partisipasi", score: 10 }, { text: "Telah melibatkan partisipasi", score: 20 } ] }, { name: "Kesesuaian penugasan, kompetensi tim pelaksana dan mahasiswa", options: [ { text: "Tidak sesuai", score: 0 }, { text: "Kurang sesuai", score: 10 }, { text: "Sesuai", score: 15 }, { text: "Sangat sesuai", score: 20 } ] }, { name: "Kualitas Ipteks yang ditawarkan (hasil penelitian)", options: [ { text: "Kurang baik dan/atau tidak sesuai", score: 0 }, { text: "Cukup baik namun kurang sesuai", score: 10 }, { text: "Baik namun masih kurang sesuai", score: 20 }, { text: "Baik, sesuai, dan merupakan hasil penelitian Pengusul", score: 30 } ] }, { name: "Implementasi/Penerapan Teknologi dan Inovasi", options: [ { text: "Bukan dari hasil penelitian dan tidak jelas", score: 0 }, { text: "Bukan dari hasil penelitian namun cukup jelas", score: 10 }, { text: "Bukan dari hasil penelitian namun sangat jelas", score: 20 }, { text: "Merupakan hasil penelitian pelaksana dan jelas", score: 30 } ] }, { name: "Kewajaran tahapan target capaian luaran wajib dan penyelesaian", options: [ { text: "Tidak rasional/tidak jelas", score: 0 }, { text: "Kurang jelas", score: 10 }, { text: "Jelas", score: 15 }, { text: "Sangat jelas", score: 20 } ] }, { name: "Kesesuaian jadwal", options: [ { text: "Tidak sesuai/kurang sesuai", score: 0 }, { text: "Sesuai dengan tahapan dan waktu", score: 20 } ] }, { name: "Rencana Anggaran Biaya", options: [ { text: "Tidak sesuai ketentuan/tidak rasional", score: 0 }, { text: "Beberapa komponen belum rasional", score: 10 }, { text: "Cukup rasional dan sesuai HPS", score: 20 } ] }, { name: "Rencana Peningkatan level keberdayaan Mitra", options: [ { text: "Tidak sesuai dengan permasalahan", score: 0 }, { text: "Sesuai namun tidak terkuantifikasi", score: 15 }, { text: "Sesuai dan terkuantifikasi", score: 25 } ] }, { name: "Satu artikel ilmiah yang dipublikasikan terakreditasi SINTA", options: [ { text: "Tidak ada link jurnal/tidak terakreditasi", score: 0 }, { text: "Ada link jurnal dan terakreditasi SINTA", score: 10 } ] }, { name: "Satu artikel pada media massa cetak/elektronik", options: [ { text: "Tidak ada/tidak sesuai ketentuan", score: 0 }, { text: "Ada link media massa lokal", score: 5 }, { text: "Ada link media massa nasional", score: 10 } ] }, { name: "Video kegiatan", options: [ { text: "Tidak ada link/bukan YouTube lembaga", score: 0 }, { text: "Ada link YouTube lembaga", score: 10 } ] }, ] } ],
        'PBM-M': [ { title: "REKAM JEJAK", maxScore: 20, components: [ { name: "Kualitas dan Kuantitas Publikasi Artikel di Jurnal Ilmiah (Dosen Pembimbing)", options: [ { text: "Dosen pembimbing memiliki publikasi < 3 artikel", score: 5 }, { text: "Dosen pembimbing memiliki publikasi 3-5 artikel", score: 10 }, { text: "Dosen pembimbing memiliki publikasi 6-10 artikel", score: 15 }, { text: "Dosen pembimbing memiliki publikasi > 10 artikel", score: 20 }, ] } ] }, { title: "SUBSTANSI", maxScore: 380, components: [ { name: "Penjelasan kondisi eksisting mitra seperti profil, potensi masyarakat dan wilayah", options: [ { text: "Tidak lengkap dan tidak jelas", score: 0 }, { text: "Tidak lengkap namun cukup jelas / lengkap namun tidak jelas", score: 10 }, { text: "Lengkap dan jelas", score: 20 }, { text: "Lengkap, jelas, dan runtut", score: 25 } ] }, { name: "Ketajaman analisis situasi permasalahan mitra sasaran", options: [ { text: "Tidak jelas", score: 0 }, { text: "Cukup jelas", score: 10 }, { text: "Jelas", score: 20 }, { text: "Sangat jelas", score: 25 } ] }, { name: "Rumusan masalah prioritas minimal 2 bidang permasalahan", options: [ { text: "Tidak jelas", score: 0 }, { text: "Cukup jelas", score: 10 }, { text: "Jelas", score: 20 }, { text: "Sangat jelas", score: 25 } ] }, { name: "Kesesuaian solusi dengan permasalahan Mitra", options: [ { text: "Tidak sesuai", score: 0 }, { text: "Kurang sesuai", score: 10 }, { text: "Sesuai", score: 20 }, { text: "Sangat sesuai", score: 30 } ] }, { name: "Metode dan rencana kegiatan yang ditawarkan", options: [ { text: "Tidak sesuai", score: 0 }, { text: "Kurang sesuai", score: 10 }, { text: "Sesuai", score: 20 }, { text: "Sesuai dan dapat berkelanjutan", score: 30 } ] }, { name: "Pelaksanaan pengabdian dan metode penyelesaian masalah", options: [ { text: "Tidak menggambarkan 5 tahapan", score: 0 }, { text: "Kurang menggambarkan 5 tahapan", score: 10 }, { text: "Telah menggambarkan 5 tahapan", score: 20 }, { text: "Telah menggambarkan 5 tahapan, jelas dan rasional", score: 30 } ] }, { name: "Partisipasi mitra sasaran", options: [ { text: "Tidak melibatkan partisipasi", score: 0 }, { text: "Kurang melibatkan partisipasi", score: 10 }, { text: "Telah melibatkan partisipasi", score: 20 } ] }, { name: "Kesesuaian penugasan, kompetensi tim pelaksana dan mahasiswa", options: [ { text: "Tidak sesuai", score: 0 }, { text: "Kurang sesuai", score: 10 }, { text: "Sesuai", score: 15 }, { text: "Sangat sesuai", score: 20 } ] }, { name: "Kualitas Ipteks yang ditawarkan (hasil penelitian)", options: [ { text: "Kurang baik dan/atau tidak sesuai", score: 0 }, { text: "Cukup baik namun kurang sesuai", score: 10 }, { text: "Baik namun masih kurang sesuai", score: 20 }, { text: "Baik, sesuai, dan merupakan hasil penelitian Pengusul", score: 30 } ] }, { name: "Implementasi/Penerapan Teknologi dan Inovasi", options: [ { text: "Bukan dari hasil penelitian dan tidak jelas", score: 0 }, { text: "Bukan dari hasil penelitian namun cukup jelas", score: 10 }, { text: "Bukan dari hasil penelitian namun sangat jelas", score: 20 }, { text: "Merupakan hasil penelitian pelaksana dan jelas", score: 30 } ] }, { name: "Kewajaran tahapan target capaian luaran wajib", options: [ { text: "Tidak rasional/tidak jelas", score: 0 }, { text: "Kurang jelas", score: 10 }, { text: "Jelas", score: 15 }, { text: "Sangat jelas", score: 20 } ] }, { name: "Kesesuaian jadwal", options: [ { text: "Tidak sesuai/kurang sesuai", score: 0 }, { text: "Sesuai dengan tahapan dan waktu", score: 20 } ] }, { name: "Rencana Anggaran Biaya", options: [ { text: "Tidak sesuai ketentuan/tidak rasional", score: 0 }, { text: "Beberapa komponen belum rasional", score: 10 }, { text: "Cukup rasional dan sesuai HPS", score: 20 } ] }, { name: "Rencana Peningkatan level keberdayaan Mitra", options: [ { text: "Tidak sesuai dengan permasalahan", score: 0 }, { text: "Sesuai namun tidak terkuantifikasi", score: 15 }, { text: "Sesuai dan terkuantifikasi", score: 25 } ] }, { name: "Artikel ilmiah (Jurnal/Prosiding)", options: [ { text: "Tidak ada/tidak sesuai ketentuan", score: 0 }, { text: "Ada link namun tidak sesuai", score: 10 }, { text: "Ada link dan sesuai ketentuan", score: 20 } ] }, { name: "Video kegiatan", options: [ { text: "Tidak ada link/bukan YouTube lembaga", score: 0 }, { text: "Ada link YouTube lembaga", score: 10 } ] }, ] } ],
    },
    "output_akhir": {"title": "Penilaian Laporan Akhir","groups": [{"name": "Publikasi dan Produk Final","items": [{"key": "final_output","label": "Kualitas luaran akhir (publikasi/produk/paten) sesuai standar","weight": 100,"options": [{"text": "Sangat Baik","score": 4},{"text": "Baik","score": 3},{"text": "Cukup","score": 2},{"text": "Kurang","score": 1}]}],"weight": 100}]},
    "output_kemajuan": {"title": "Penilaian Laporan Kemajuan","groups": [{"name": "Capaian Luaran","items": [{"key": "capaian_wajib","label": "Kesesuaian capaian luaran wajib dengan proposal","weight": 40,"options": [{"text": "Sangat Sesuai","score": 4},{"text": "Sesuai","score": 3},{"text": "Kurang Sesuai","score": 2},{"text": "Tidak Sesuai","score": 1}]}],"weight": 60},{"name": "Logbook & Laporan","items": [{"key": "kelengkapan_logbook","label": "Kelengkapan dan kerutinan pengisian logbook","weight": 40,"options": [{"text": "Sangat Lengkap & Rutin","score": 4},{"text": "Lengkap","score": 3},{"text": "Kurang Lengkap","score": 2},{"text": "Tidak Lengkap","score": 1}]}],"weight": 40}]
    },
};

    const initialProposalFields = {
        penelitian: [
        { key: "pendahuluan", label: "Pendahuluan", type: "textarea" },
        { key: "metode", label: "Metode Penelitian", type: "textarea" },
        { key: "hasilDiharapkan", label: "Hasil yang Diharapkan", type: "textarea" },
        ],
        pengabdian: [
        { key: "analisisSituasi", label: "Analisis Situasi & Permasalahan Mitra", type: "textarea" },
        { key: "solusiPermasalahan", label: "Solusi Permasalahan", type: "textarea" },
        ],
        common: [
        { key: "referensi", label: "Daftar Pustaka", type: "textarea" }
        ]
    };

    const initialDocumentSettings = {
        penelitian: [{ id: 'doc_pen_1', name: 'Proposal Lengkap', isRequired: true }],
        pengabdian: [{ id: 'doc_peng_1', name: 'Proposal Lengkap', isRequired: true }],
    };

    await prisma.setting.upsert({
        where: { settingKey: 'document_settings' },
        update: { settingValue: initialDocumentSettings },
        create: { settingKey: 'document_settings', settingValue: initialDocumentSettings },
    });

    await prisma.setting.upsert({
        where: { settingKey: 'schedules'},
        update: {},
        create: {
            settingKey: 'schedules',
            settingValue: {
                proposalPeriod: { start: '2025-07-01', end: '2025-07-31' },
                luaranPeriod: { start: '2025-11-01', end: '2025-11-30' },
            }
        }
    });

    await prisma.setting.upsert({
    where: { settingKey: 'assessment_criteria' },
    update: { settingValue: initialAssessmentCriteria as any },
    create: { settingKey: 'assessment_criteria', settingValue: initialAssessmentCriteria as any },
    });
    
    await prisma.setting.upsert({
        where: { settingKey: 'proposal_fields' },
        update: { settingValue: initialProposalFields as any },
        create: { settingKey: 'proposal_fields', settingValue: initialProposalFields as any },
    });

    console.log('Settings seeded.');

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
