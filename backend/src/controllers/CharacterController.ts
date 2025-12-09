import { Request, Response } from 'express';
import { CharacterGeneratorService } from '../services/CharacterGeneratorService';
import { DatabaseService } from '../services/DatabaseService';

export class CharacterController {
    
    static generate(req: Request, res: Response) {
        try {
            const { name, level, method, raceId, classId } = req.body;
            
            if (level < 1 || level > 20) {
                 res.status(400).json({ error: "Level must be between 1 and 20" });
                 return;
            }

            const generator = new CharacterGeneratorService();
            const character = generator.generateCharacter(name || "Hero", { 
                level, 
                method,
                raceId,
                classId 
            });
            
            res.json(character);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static reroll(req: Request, res: Response) {
        try {
            const { character, target } = req.body;
            
            const generator = new CharacterGeneratorService();
            const newChar = generator.generateCharacter(character.name, {
                level: character.level,
                raceId: target === 'race' ? undefined : character.race.id,
                classId: target === 'class' ? undefined : character.class.id
            });
            
            if (target === 'stats') {
                // Logic to preserve race/class if needed
            }
            
            res.json(newChar);
        } catch (error) {
            res.status(500).json({ error: "Reroll failed" });
        }
    }

    static async save(req: Request, res: Response) {
        try {
            const userId = req.headers['user-id'] as string;
            
            if (!userId) {
                res.status(401).json({ error: "Unauthorized: User ID required" });
                return;
            }

            const saved = await DatabaseService.saveCharacter(req.body, userId);
            res.json(saved);
        } catch (error) {
            console.error("Save error:", error);
            res.status(500).json({ error: "Database error" });
        }
    }

    static async list(req: Request, res: Response) {
        try {
            const userId = req.headers['user-id'] as string;
            
            if (!userId) {
                res.status(401).json({ error: "Unauthorized: User ID required" });
                return;
            }

            const list = await DatabaseService.getAllCharacters(userId);
            res.json(list);
        } catch (error) {
            console.error("List error:", error);
            res.status(500).json({ error: "Database error" });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const userId = req.headers['user-id'] as string;
            const { id } = req.params;

            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            await DatabaseService.deleteCharacter(id, userId);
            res.json({ success: true });
        } catch (error) {
            console.error("Delete error:", error);
            res.status(500).json({ error: "Delete failed" });
        }
    }
}
