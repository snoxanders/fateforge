-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "raceId" TEXT NOT NULL,
    "raceName" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "subclassId" TEXT,
    "subclassName" TEXT,
    "hp" INTEGER NOT NULL,
    "armorClass" INTEGER NOT NULL,
    "proficiencyBonus" INTEGER NOT NULL,
    "initiative" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "stats" TEXT NOT NULL,
    "modifiers" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "spells" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "personality" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);
