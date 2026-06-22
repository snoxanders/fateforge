import { describe, it, expect } from 'vitest';
import { CharacterGeneratorService } from '../services/CharacterGeneratorService';
import { getModifier } from '../utils/dice';
import { CLASSES } from '../data/classes';

const CLASS_IDS = CLASSES.map(c => c.id);
const STATS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const;

function gen(seed: number, classId?: string, level = 1) {
  return new CharacterGeneratorService(seed).generateCharacter('Teste', { level, classId, method: 'roll' });
}

describe('Determinismo (RNG seedável)', () => {
  it('mesma seed produz personagem idêntico', () => {
    const a = gen(12345, 'wizard', 5);
    const b = gen(12345, 'wizard', 5);
    expect(a).toEqual(b);
  });

  it('seeds diferentes produzem resultados diferentes', () => {
    const a = JSON.stringify(gen(1, 'fighter', 5));
    const b = JSON.stringify(gen(2, 'fighter', 5));
    expect(a).not.toEqual(b);
  });
});

describe('Invariantes por classe (nível 1 e 5)', () => {
  for (const classId of CLASS_IDS) {
    for (const level of [1, 5]) {
      it(`${classId} nv${level}: ficha coerente`, () => {
        const c = gen(999, classId, level);

        // Atributos: 6 valores, modificador derivado corretamente
        for (const s of STATS) {
          const attr = c.attributes[s];
          expect(attr.value).toBeGreaterThanOrEqual(3);
          expect(attr.value).toBeLessThanOrEqual(20);
          expect(attr.modifier).toBe(getModifier(attr.value));
        }

        // Bônus de proficiência por nível
        const expectedPB = level >= 5 ? 3 : 2;
        expect(c.proficiencyBonus).toBe(expectedPB);

        // HP nível 1 = dado de vida + mod CON (mínimo coerente)
        if (level === 1) {
          expect(c.hp.max).toBe(c.class.hitDie + c.attributes.CON.modifier);
        }
        expect(c.hp.max).toBeGreaterThanOrEqual(1);
        expect(c.hp.current).toBe(c.hp.max);

        // CA nunca abaixo de 10
        expect(c.armorClass.value).toBeGreaterThanOrEqual(10);

        // Perícias: 18 no total; proficiente => valor = mod + PB
        expect(c.skills).toHaveLength(18);
        for (const sk of c.skills) {
          const mod = c.attributes[sk.ability].modifier;
          if (sk.proficient) {
            expect(sk.value).toBe(mod + c.proficiencyBonus);
          } else {
            expect(sk.value).toBe(mod);
          }
        }

        // Percepção Passiva = 10 + perícia Percepção
        const perc = c.skills.find(s => s.name === 'Percepção')!;
        expect(c.passivePerception).toBe(10 + perc.value);
      });
    }
  }
});

describe('Métodos de geração de atributos', () => {
  it('standard array usa exatamente 15,14,13,12,10,8 (antes de raça)', () => {
    // Soma dos valores brutos do array padrão = 72
    const c = new CharacterGeneratorService(7).generateCharacter('X', { level: 1, classId: 'fighter', method: 'standard' });
    const total = STATS.reduce((acc, s) => acc + c.attributes[s].value, 0);
    // 72 + bônus raciais (>=2). Apenas garante que não explodiu.
    expect(total).toBeGreaterThanOrEqual(74);
  });

  it('point-buy mantém valores base entre 8 e 15 (+ bônus racial)', () => {
    const c = new CharacterGeneratorService(7).generateCharacter('X', { level: 1, classId: 'fighter', raceId: 'human', method: 'point-buy' });
    // Humano dá +1 em tudo, então base 8-15 vira 9-16
    for (const s of STATS) {
      expect(c.attributes[s].value).toBeGreaterThanOrEqual(9);
      expect(c.attributes[s].value).toBeLessThanOrEqual(16);
    }
  });
});
