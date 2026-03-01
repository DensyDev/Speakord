-- CreateTable
CREATE TABLE "GuildSettings" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuildSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildSettings_guildId_key" ON "GuildSettings"("guildId");
