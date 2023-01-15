-- CreateEnum
CREATE TYPE "Language" AS ENUM ('es', 'en');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstname" TEXT,
    "language" "Language" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hero" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "realName" TEXT NOT NULL,
    "alterEgo" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL,
    "userId" TEXT DEFAULT '',

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VotesOnHeroes" (
    "userId" TEXT NOT NULL DEFAULT '',
    "heroId" TEXT NOT NULL DEFAULT '',
    "assignedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VotesOnHeroes_pkey" PRIMARY KEY ("userId","heroId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Hero" ADD CONSTRAINT "Hero_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotesOnHeroes" ADD CONSTRAINT "VotesOnHeroes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotesOnHeroes" ADD CONSTRAINT "VotesOnHeroes_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "Hero"("id") ON DELETE CASCADE ON UPDATE CASCADE;
