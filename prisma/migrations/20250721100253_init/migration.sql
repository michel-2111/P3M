-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "nidnNim" TEXT NOT NULL,
    "peran" JSONB NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "namaProgram" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "detailLainnya" JSONB NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "abstrak" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "detailProposal" JSONB NOT NULL,
    "dokumenDiunggah" JSONB,
    "programId" TEXT NOT NULL,
    "userIdKetua" TEXT NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalMember" (
    "id" SERIAL NOT NULL,
    "statusPersetujuan" TEXT NOT NULL,
    "proposalId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ProposalMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "skor" JSONB NOT NULL,
    "catatan" TEXT,
    "rekomendasi" TEXT NOT NULL,
    "proposalId" INTEGER NOT NULL,
    "reviewerId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogbookEntry" (
    "id" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "kegiatan" TEXT NOT NULL,
    "bukti" TEXT,
    "proposalId" INTEGER NOT NULL,

    CONSTRAINT "LogbookEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidationTask" (
    "id" SERIAL NOT NULL,
    "checklist" JSONB NOT NULL,
    "catatan" TEXT,
    "rekomendasi" TEXT NOT NULL,
    "proposalId" INTEGER NOT NULL,
    "reviewerId" TEXT NOT NULL,

    CONSTRAINT "ValidationTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "pesan" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "sudahDibaca" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "settingKey" TEXT NOT NULL,
    "settingValue" JSONB NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("settingKey")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nidnNim_key" ON "User"("nidnNim");

-- CreateIndex
CREATE UNIQUE INDEX "Program_id_key" ON "Program"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProposalMember_proposalId_userId_key" ON "ProposalMember"("proposalId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_settingKey_key" ON "Setting"("settingKey");

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_userIdKetua_fkey" FOREIGN KEY ("userIdKetua") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalMember" ADD CONSTRAINT "ProposalMember_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalMember" ADD CONSTRAINT "ProposalMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogbookEntry" ADD CONSTRAINT "LogbookEntry_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationTask" ADD CONSTRAINT "ValidationTask_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationTask" ADD CONSTRAINT "ValidationTask_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
