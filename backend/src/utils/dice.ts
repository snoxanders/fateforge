// RNG injetável e determinístico.
// Sem seed, usa Math.random (comportamento de produção).
// Com seed, usa mulberry32 -> geração reproduzível (testes + "compartilhar por seed").
export type RNG = () => number;

export const mulberry32 = (seed: number): RNG => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const rollDie = (sides: number, rng: RNG = Math.random): number => {
  return Math.floor(rng() * sides) + 1;
};

export const roll4d6DropLowest = (rng: RNG = Math.random): number => {
  const rolls = [rollDie(6, rng), rollDie(6, rng), rollDie(6, rng), rollDie(6, rng)];
  rolls.sort((a, b) => a - b); // Ordena ascendente
  rolls.shift(); // Remove o menor (primeiro)
  return rolls.reduce((acc, val) => acc + val, 0);
};

export const getModifier = (stat: number): number => {
  return Math.floor((stat - 10) / 2);
};
