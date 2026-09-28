-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "EnrollStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "images" (
    "imageId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("imageId")
);

-- CreateTable
CREATE TABLE "courses" (
    "courseId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "level" "Level" NOT NULL,
    "duration" TEXT,
    "depositFees" DECIMAL(10,2),
    "fees" DECIMAL(10,2),
    "imageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("courseId")
);

-- CreateTable
CREATE TABLE "courseOutlines" (
    "courseOutlineId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courseOutlines_pkey" PRIMARY KEY ("courseOutlineId")
);

-- CreateTable
CREATE TABLE "prerequisite" (
    "prerequisiteId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prerequisite_pkey" PRIMARY KEY ("prerequisiteId")
);

-- CreateTable
CREATE TABLE "batches" (
    "batchId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "classTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("batchId")
);

-- CreateTable
CREATE TABLE "paymentAccounts" (
    "paymentAccountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "iconId" TEXT NOT NULL,
    "qrcodeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paymentAccounts_pkey" PRIMARY KEY ("paymentAccountId")
);

-- CreateTable
CREATE TABLE "enrolls" (
    "enrollId" TEXT NOT NULL,
    "status" "EnrollStatus",
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "paymentAccountId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "paymentSSId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enrolls_pkey" PRIMARY KEY ("enrollId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_userName_key" ON "users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "courses_imageId_key" ON "courses"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "paymentAccounts_iconId_key" ON "paymentAccounts"("iconId");

-- CreateIndex
CREATE UNIQUE INDEX "paymentAccounts_qrcodeId_key" ON "paymentAccounts"("qrcodeId");

-- CreateIndex
CREATE UNIQUE INDEX "enrolls_paymentSSId_key" ON "enrolls"("paymentSSId");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("imageId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courseOutlines" ADD CONSTRAINT "courseOutlines_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("courseId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prerequisite" ADD CONSTRAINT "prerequisite_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("courseId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paymentAccounts" ADD CONSTRAINT "paymentAccounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paymentAccounts" ADD CONSTRAINT "paymentAccounts_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "images"("imageId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paymentAccounts" ADD CONSTRAINT "paymentAccounts_qrcodeId_fkey" FOREIGN KEY ("qrcodeId") REFERENCES "images"("imageId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrolls" ADD CONSTRAINT "enrolls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrolls" ADD CONSTRAINT "enrolls_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrolls" ADD CONSTRAINT "enrolls_paymentAccountId_fkey" FOREIGN KEY ("paymentAccountId") REFERENCES "paymentAccounts"("paymentAccountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrolls" ADD CONSTRAINT "enrolls_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "batches"("batchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrolls" ADD CONSTRAINT "enrolls_paymentSSId_fkey" FOREIGN KEY ("paymentSSId") REFERENCES "images"("imageId") ON DELETE RESTRICT ON UPDATE CASCADE;
