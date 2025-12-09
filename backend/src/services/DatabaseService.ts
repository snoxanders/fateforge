import { PrismaClient } from '@prisma/client';
import { Character } from '../models/Character';

const prisma = new PrismaClient();

export class DatabaseService {
  
  static async saveCharacter(character: Character, userId?: string) {
    const data = {
        name: character.name,
        level: character.level,
        userId: userId || null,
        raceId: character.race.id,
        raceName: character.race.name,
        classId: character.class.id,
        className: character.class.name,
        subclassId: character.subclass?.id || null,
        subclassName: character.subclass?.name || null,
        
        hp: character.hp,
        armorClass: character.armorClass,
        proficiencyBonus: character.proficiencyBonus,
        initiative: character.initiative,
        speed: character.speed,
        
        stats: JSON.stringify(character.stats),
        modifiers: JSON.stringify(character.modifiers),
        skills: JSON.stringify(character.skills),
        equipment: JSON.stringify(character.equipment),
        spells: JSON.stringify(character.spells || {}),
        
        background: JSON.stringify(character.background),
        personality: JSON.stringify(character.personality)
    };

    return await prisma.character.create({
        data
    });
  }

  static async getAllCharacters(userId?: string) {
    if (!userId) return [];

    const records = await prisma.character.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });

    return records.map((record: any) => ({
        id: record.id,
        name: record.name,
        level: record.level,
        userId: record.userId,
        race: { id: record.raceId, name: record.raceName, speed: record.speed, size: 'Medium' },
        class: { id: record.classId, name: record.className, hitDie: 8 },
        subclass: record.subclassId ? { id: record.subclassId, name: record.subclassName } : undefined,
        
        hp: record.hp,
        armorClass: record.armorClass,
        proficiencyBonus: record.proficiencyBonus,
        initiative: record.initiative,
        speed: record.speed,
        
        stats: JSON.parse(record.stats),
        modifiers: JSON.parse(record.modifiers),
        skills: JSON.parse(record.skills),
        equipment: JSON.parse(record.equipment),
        spells: JSON.parse(record.spells),
        
        background: JSON.parse(record.background),
        personality: JSON.parse(record.personality),
        createdAt: record.createdAt.toISOString()
    }));
  }

  static async deleteCharacter(id: string, userId?: string) {
    if (!userId) throw new Error("Unauthorized delete");

    return await prisma.character.deleteMany({
        where: { id, userId }
    });
  }
}
