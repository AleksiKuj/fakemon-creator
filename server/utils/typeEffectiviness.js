//0.5 not very effective, 1 normal, 1.5 super effective
const typeEffectiveness = {
  normal: {
    normal: 1, fighting: 1, flying: 1, poison: 1, ground: 1, rock: 0.5, bug: 1, ghost: 0.5, steel: 0.5, fire: 1, water: 1, grass: 1, electric: 1, psychic: 1, ice: 1, dragon: 1, dark: 1, fairy: 1,
  },
  fighting: {
    normal: 1.5, fighting: 1, flying: 0.5, poison: 0.5, ground: 1, rock: 1.5, bug: 0.5, ghost: 0.5, steel: 1.5, fire: 1, water: 1, grass: 1, electric: 1, psychic: 0.5, ice: 1.5, dragon: 1, dark: 1.5, fairy: 0.5,
  },
  flying: {
    normal: 1, fighting: 1.5, flying: 1, poison: 1, ground: 1, rock: 0.5, bug: 1.5, ghost: 1, steel: 0.5, fire: 1, water: 1, grass: 1.5, electric: 0.5, psychic: 1, ice: 1, dragon: 1, dark: 1, fairy: 1,
  },
  poison: {
    normal: 1, fighting: 1, flying: 1, poison: 0.5, ground: 0.5, rock: 0.5, bug: 1, ghost: 0.5, steel: 0.5, fire: 1, water: 1, grass: 1.5, electric: 1, psychic: 1, ice: 1, dragon: 1, dark: 1, fairy: 1.5,
  },
  ground: {
    normal: 1, fighting: 1, flying: 0.5, poison: 1.5, ground: 1, rock: 1.5, bug: 0.5, ghost: 1, steel: 1.5, fire: 1.5, water: 1, grass: 0.5, electric: 1.5, psychic: 1, ice: 1, dragon: 1, dark: 1, fairy: 1,
  },
  rock: {
    normal: 1, fighting: 0.5, flying: 1.5, poison: 1, ground: 0.5, rock: 1, bug: 1.5, ghost: 1, steel: 0.5, fire: 1.5, water: 1, grass: 1, electric: 1, psychic: 1, ice: 1.5, dragon: 1, dark: 1, fairy: 1,
  },
  bug: {
    normal: 1, fighting: 0.5, flying: 0.5, poison: 0.5, ground: 1, rock: 1, bug: 1, ghost: 0.5, steel: 0.5, fire: 0.5, water: 1, grass: 1.5, electric: 1, psychic: 1.5, ice: 1, dragon: 1, dark: 1.5, fairy: 0.5,
  },
  ghost: {
    normal: 0.5, fighting: 1, flying: 1, poison: 1, ground: 1, rock: 1, bug: 1, ghost: 1.5, steel: 1, fire: 1, water: 1, grass: 1, electric: 1, psychic: 1.5, ice: 1, dragon: 1, dark: 0.5, fairy: 1,
  },
  steel: {
    normal: 0.5, fighting: 1.5, flying: 0.5, poison: 0.5, ground: 1.5, rock: 0.5, bug: 0.5, ghost: 1, steel: 0.5, fire: 0.5, water: 0.5, grass: 1, electric: 0.5, psychic: 1, ice: 1.5, dragon: 0.5, dark: 1, fairy: 0.5,
  },
  fire: {
    normal: 1, fighting: 1, flying: 1, poison: 1, ground: 1.5, rock: 0.5, bug: 1.5, ghost: 1, steel: 1.5, fire: 0.5, water: 0.5, grass: 1.5, electric: 1, psychic: 1, ice: 1.5, dragon: 0.5, dark: 1, fairy: 1,
  },
  water: {
    normal: 1, fighting: 1, flying: 1, poison: 1, ground: 1, rock: 1.5, bug: 1, ghost: 1, steel: 1, fire: 1.5, water: 0.5, grass: 0.5, electric: 1, psychic: 1, ice: 1, dragon: 0.5, dark: 1, fairy: 1,
  },
  grass: {
    normal: 1, fighting: 1, flying: 0.5, poison: 0.5, ground: 1.5, rock: 1.5, bug: 0.5, ghost: 1, steel: 0.5, fire: 0.5, water: 1.5, grass: 0.5, electric: 1, psychic: 1, ice: 1, dragon: 0.5, dark: 1, fairy: 1,
  },
  electric: {
    normal: 1, fighting: 1, flying: 1.5, poison: 1, ground: 0.5, rock: 1, bug: 1, ghost: 1, steel: 0.5, fire: 1, water: 1.5, grass: 0.5, electric: 0.5, psychic: 1, ice: 1, dragon: 0.5, dark: 1, fairy: 1,
  },
  psychic: {
    normal: 1, fighting: 1.5, flying: 1, poison: 1.5, ground: 1, rock: 1, bug: 1, ghost: 1, steel: 0.5, fire: 1, water: 1, grass: 1, electric: 1, psychic: 0.5, ice: 1, dragon: 1, dark: 0.5, fairy: 1,
  },
  ice: {
    normal: 1, fighting: 1, flying: 1.5, poison: 1, ground: 1.5, rock: 1, bug: 1, ghost: 1, steel: 0.5, fire: 0.5, water: 0.5, grass: 1.5, electric: 1, psychic: 1, ice: 0.5, dragon: 1.5, dark: 1, fairy: 1,
  },
  dragon: {
    normal: 1, fighting: 1, flying: 1, poison: 1, ground: 1, rock: 1, bug: 1, ghost: 1, steel: 0.5, fire: 1, water: 1, grass: 1, electric: 1, psychic: 1, ice: 1.5, dragon: 1.5, dark: 1, fairy: 1.5,
  },
  dark: {
    normal: 1, fighting: 0.5, flying: 1, poison: 1, ground: 1, rock: 1, bug: 1, ghost: 1.5, steel: 1, fire: 1, water: 1, grass: 1, electric: 1, psychic: 1.5, ice: 1, dragon: 1, dark: 0.5, fairy: 0.5,
  },
  fairy: {
    normal: 1, fighting: 1.5, flying: 1, poison: 0.5, ground: 1, rock: 1, bug: 1, ghost: 1, steel: 1.5, fire: 0.5, water: 1, grass: 1, electric: 1, psychic: 1, ice: 1, dragon: 0.5, dark: 1.5, fairy: 1,
  }
}

module.exports = {typeEffectiveness}