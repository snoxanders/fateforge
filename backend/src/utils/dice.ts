export const rollDie = (sides: number): number => {
  return Math.floor(Math.random() * sides) + 1;
};

export const roll4d6DropLowest = (): number => {
  const rolls = [rollDie(6), rollDie(6), rollDie(6), rollDie(6)];
  rolls.sort((a, b) => a - b); // Ordena ascendente
  rolls.shift(); // Remove o menor (primeiro)
  return rolls.reduce((acc, val) => acc + val, 0);
};

export const getModifier = (stat: number): number => {
  return Math.floor((stat - 10) / 2);
};

