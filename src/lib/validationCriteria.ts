// src/lib/validationCriteria.ts

export const validationCriteria: Record<string, string[]> = {
    'jurnal': ['Bukti korespondensi dengan penerbit', 'Surat keterangan accepted', 'Cover, daftar isi, dan artikel', 'Link publikasi (URL/DOI)'],
    'prosiding': ['Bukti korespondensi dengan penerbit', 'Surat keterangan accepted', 'Cover, daftar isi, dan artikel', 'Link publikasi yang bisa diakses'],
    'paten': ['Surat nomor pendaftaran dari Sentra HKI', 'Deskripsi dan spesifikasi paten', 'Dokumentasi pengujian (foto/video)', 'Manual book'],
    'buku': ['Surat keterangan terbit dari penerbit', 'Softcopy buku dalam format PDF'],
    'produk_industri': ['Deskripsi dan spesifikasi produk', 'Dokumen hasil uji produk', 'Dokumentasi pengujian (foto/video)'],
    'media_massa': ['Artikel yang tayang tersedia', 'Link artikel yang bisa diakses'],
    'video': ['URL Video di channel YouTube P3M Polimdo'],
    'poster': ['File Poster Digital', 'Deskripsi kegiatan', 'Hasil uji skor (jika ada)'],
    'laporan': ['Laporan akhir lengkap (softcopy/hardcopy)'],
    'default': ['Dokumen bukti luaran tersedia']
};

export const getOutputValidationType = (outputString: string): string => {
    const lowerCaseOutput = outputString.toLowerCase();
    if (lowerCaseOutput.includes('jurnal')) return 'jurnal';
    if (lowerCaseOutput.includes('prosiding')) return 'prosiding';
    if (lowerCaseOutput.includes('paten')) return 'paten';
    if (lowerCaseOutput.includes('buku')) return 'buku';
    if (lowerCaseOutput.includes('produk industri')) return 'produk_industri';
    if (lowerCaseOutput.includes('media massa')) return 'media_massa';
    if (lowerCaseOutput.includes('video')) return 'video';
    if (lowerCaseOutput.includes('poster')) return 'poster';
    if (lowerCaseOutput.includes('laporan')) return 'laporan';
    return 'default';
};
