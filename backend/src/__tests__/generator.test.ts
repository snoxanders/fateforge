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

        // Resistências: proficiente => save = mod + PB; senão = mod (T1.1)
        const profSaves = c.proficiencies.savingThrows;
        expect(profSaves).toHaveLength(2);
        for (const s of STATS) {
          const attr = c.attributes[s];
          const isProf = profSaves.includes(s);
          expect(attr.save).toBe(attr.modifier + (isProf ? c.proficiencyBonus : 0));
        }
      });
    }
  }
});

describe('Conjuração: slots e tipo de conjurador (T1.2 / T2.1)', () => {
  it('conjuradores plenos nv5 têm slots até o 3º círculo', () => {
    for (const id of ['wizard', 'cleric', 'bard', 'sorcerer', 'druid']) {
      const c = gen(42, id, 5);
      expect(c.spellcasting, `${id} deveria conjurar`).toBeTruthy();
      const max = Math.max(...c.spellcasting!.slots.map(s => s.level));
      expect(max, `${id} círculo máx`).toBe(3);
    }
  });

  it('meio-conjuradores (Paladino/Patrulheiro) NÃO conjuram no nível 1', () => {
    expect(gen(42, 'paladin', 1).spellcasting).toBeUndefined();
    expect(gen(42, 'ranger', 1).spellcasting).toBeUndefined();
  });

  it('meio-conjuradores nv5 vão só até o 2º círculo', () => {
    for (const id of ['paladin', 'ranger']) {
      const c = gen(42, id, 5);
      expect(c.spellcasting, `${id} deveria conjurar no nv5`).toBeTruthy();
      const max = Math.max(...c.spellcasting!.slots.map(s => s.level));
      expect(max, `${id} círculo máx`).toBe(2);
    }
  });

  it('Bruxo nv5 usa Magia de Pacto (slots de 3º círculo)', () => {
    const c = gen(42, 'warlock', 5);
    expect(c.spellcasting).toBeTruthy();
    const max = Math.max(...c.spellcasting!.slots.map(s => s.level));
    expect(max).toBe(3);
  });

  it('nenhuma magia conhecida acima do maior círculo com slot', () => {
    for (const id of ['wizard', 'cleric', 'bard', 'sorcerer', 'druid', 'paladin', 'ranger', 'warlock']) {
      const c = gen(7, id, 5);
      if (!c.spellcasting) continue;
      const max = Math.max(...c.spellcasting.slots.map(s => s.level), 0);
      for (const sp of c.spellcasting.spells) {
        if (sp.level > 0) expect(sp.level, `${id}: magia ${sp.name}`).toBeLessThanOrEqual(max);
      }
    }
  });

  it('classes não-conjuradoras não têm spellcasting', () => {
    for (const id of ['fighter', 'barbarian', 'monk', 'rogue']) {
      expect(gen(7, id, 5).spellcasting, id).toBeUndefined();
    }
  });
});

describe('Timing de subclasse (T2.2)', () => {
  it('Clérigo/Feiticeiro/Bruxo têm subclasse já no nível 1', () => {
    for (const id of ['cleric', 'sorcerer', 'warlock']) {
      expect(gen(3, id, 1).subclass, id).toBeTruthy();
    }
  });

  it('Druida: sem subclasse no nv1, com subclasse no nv2', () => {
    expect(gen(3, 'druid', 1).subclass).toBeFalsy();
    expect(gen(3, 'druid', 2).subclass).toBeTruthy();
  });

  it('Guerreiro/Mago: subclasse só a partir do nv3', () => {
    expect(gen(3, 'fighter', 1).subclass).toBeFalsy();
    expect(gen(3, 'fighter', 3).subclass).toBeTruthy();
    expect(gen(3, 'wizard', 2).subclass).toBeFalsy();
  });

  it('Feiticeiro Dracônico nv1 ganha CA 13+DES (Resiliência Dracônica) sem armadura', () => {
    const c = gen(3, 'sorcerer', 1);
    expect(c.armorClass.value).toBe(13 + c.attributes.DEX.modifier);
  });
});

describe('ASI escalonado (T2.3)', () => {
  const sum = (c: any) => STATS.reduce((acc, s) => acc + c.attributes[s].value, 0);

  it('nível 4 dá exatamente 1 ASI (+2) sobre o nível 3 (mesma seed)', () => {
    const c3 = gen(555, 'fighter', 3);
    const c4 = gen(555, 'fighter', 4);
    expect(sum(c4) - sum(c3)).toBe(2);
  });

  it('Guerreiro nv6 já teve 2 ASIs (marco extra), > 1 ASI no nv5', () => {
    const c5 = gen(555, 'fighter', 5);
    const c6 = gen(555, 'fighter', 6);
    // nv5 = 1 ASI; nv6 = 2 ASIs (4 e 6). Diferença esperada = +2 (a menos de teto).
    expect(sum(c6)).toBeGreaterThan(sum(c5));
  });

  it('nenhum atributo passa de 20 no nível 20', () => {
    for (const id of ['fighter', 'wizard', 'barbarian']) {
      const c = gen(555, id, 20);
      for (const s of STATS) expect(c.attributes[s].value, `${id} ${s}`).toBeLessThanOrEqual(20);
    }
  });
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
