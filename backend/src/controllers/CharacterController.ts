import { Request, Response } from 'express';
import { CharacterGeneratorService } from '../services/CharacterGeneratorService';
import { GenerationMethod, Character } from '../models/Character';

const generatorService = new CharacterGeneratorService();

export class CharacterController {
  
  static generate(req: Request, res: Response) {
    try {
      const { name, level, method, classId, raceId } = req.body;

      // Garante que string vazia venha como undefined para permitir randomização
      const safeClassId = classId && classId !== "" ? classId : undefined;
      const safeRaceId = raceId && raceId !== "" ? raceId : undefined;

      const preferences = {
        level: level ? parseInt(level) : 1,
        method: method as GenerationMethod,
        classId: safeClassId,
        raceId: safeRaceId
      };

      const character = generatorService.generateCharacter(name, preferences);
      
      res.json(character);
    } catch (error) {
      console.error('Error generating character:', error);
      res.status(500).json({ error: 'Failed to generate character' });
    }
  }

  // Novo endpoint para re-roll parcial
  static reroll(req: Request, res: Response) {
    try {
      const { character, target } = req.body; 
      // target pode ser: 'race', 'class', 'stats'

      if (!character) {
         res.status(400).json({ error: 'Character data is required' });
         return;
      }

      // Recriar o personagem mantendo os outros campos
      // Isso é uma abordagem simplificada. O ideal seria ter o ID e refazer no server,
      // mas como não temos DB ainda, vamos reconstruir baseado no JSON enviado.
      
      const preferences = {
        level: character.level,
        // Se o alvo NÃO for race, mantemos a race atual
        raceId: target !== 'race' ? character.race.id : undefined,
        // Se o alvo NÃO for class, mantemos a class atual
        classId: target !== 'class' ? character.class.id : undefined,
        method: 'roll' as GenerationMethod // Default
      };

      // Geramos um NOVO personagem com as restrições
      const newCharacter = generatorService.generateCharacter(character.name, preferences);

      // Se for apenas re-roll de atributos, mantemos raça e classe originais EXATAS
      // Mas note que re-rolar raça muda atributos (bônus).
      // Re-rolar classe muda prioridade de atributos.
      
      // Merge inteligente:
      const result: Character = { ...newCharacter };
      
      if (target === 'stats') {
         // Mantemos tudo do antigo, só mudamos stats e derivados
         result.race = character.race;
         result.class = character.class;
         result.background = character.background;
         result.personality = character.personality;
         result.name = character.name;
         // Stats foram regerados no newCharacter
      } else if (target === 'race') {
         // Mudou raça: muda stats (bônus), traits, speed, mas mantem classe
         result.class = character.class;
         result.background = character.background; // Mantém background? Pode ser.
      } else if (target === 'class') {
         // Mudou classe: muda stats (prioridade), hp, proficiencias, features
         result.race = character.race;
         result.background = character.background;
      }

      res.json(result);

    } catch (error) {
      console.error('Error rerolling character:', error);
      res.status(500).json({ error: 'Failed to reroll character' });
    }
  }
}
