-- CreateTable
CREATE TABLE "penelitian" (
    "id" SERIAL NOT NULL,
    "judul" TEXT,
    "skema" VARCHAR(100),
    "nip_ketua" VARCHAR(50),
    "jumlah_member" INTEGER,
    "jurusan" VARCHAR(50),
    "status" VARCHAR(50),
    "tanggal_dibuat" DATE,

    CONSTRAINT "penelitian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengabdian" (
    "id" SERIAL NOT NULL,
    "judul" TEXT,
    "skema" VARCHAR(100),
    "nip_ketua" VARCHAR(50),
    "jumlah_member" INTEGER,
    "jurusan" VARCHAR(50),
    "status" VARCHAR(50),
    "tanggal_dibuat" DATE,

    CONSTRAINT "pengabdian_pkey" PRIMARY KEY ("id")
);
