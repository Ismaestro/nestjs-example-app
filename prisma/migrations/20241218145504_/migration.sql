-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ES_ES', 'EN_US');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "favouritePokemonId" INTEGER NOT NULL,
    "language" "Language" NOT NULL,
    "terms" BOOLEAN NOT NULL DEFAULT false,
    "caughtPokemonIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
