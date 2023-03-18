const pokemonTypes = [
  "Bug",
  "Dark",
  "Dragon",
  "Electric",
  "Fairy",
  "Fighting",
  "Fire",
  "Flying",
  "Ghost",
  "Grass",
  "Ground",
  "Ice",
  "Normal",
  "Poison",
  "Psychic",
  "Rock",
  "Steel",
  "Water",
]
const typeColors = {
  Bug: "#A6B91A",
  Dark: "#705746",
  Dragon: "#6F35FC",
  Electric: "#F7D02C",
  Fairy: "#D685AD",
  Fighting: "#C22E28",
  Fire: "#F08030",
  Flying: "#A98FF3",
  Ghost: "#735797",
  Grass: "#7AC74C",
  Ground: "#E2BF65",
  Ice: "#96D9D6",
  Normal: "#A8A77A",
  Poison: "#A33EA1",
  Psychic: "#F95587",
  Rock: "#B6A136",
  Steel: "#B7B7CE",
  Water: "#6390F0",
}
const gradientColors = {
  Bug: "(gray.300, #f79d00, #64f38c)",
  Dark: "(#907966,#745746,#805746)",
  Dragon: "(#9b4193,#a077cc,#5F35FC)",
  Electric: "(yellow.100,#F7D02C,yellow.400)",
  Fairy: "(pink.100,#D685AD,pink.400)",
  Fighting: "(red.300,#C22E28,red.500)",
  Fire: "(orange.200,#F08030,orange.500)",
  Flying: "(purple.200,#A98FF3,purple.300)",
  Ghost: "(purple.300, #735797, purple.500)",
  Grass: "(green.100,#7AC74C,green.400)",
  Ground: "(orange.200,#E2BF65,orange.200)",
  Ice: "(blue.200,#96D9D6,blue.200)",
  Normal: "(#B9B88B,#A8A77A,#A3A226)",
  Poison: "(purple.300,#A33EA1,#A11AA1)",
  Psychic: "(red.300,#F95587,red.600)",
  Rock: "(#B6A136,#B6A136,#B6A136)",
  Steel: "(gray.200,#B7B7CE,gray.400)",
  Water: "(blue.200,#6390F0,blue.400)",
}

const typeOptions = pokemonTypes.map((type) => ({
  value: type,
  label: type,
}))

const pokemonGens = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const genOptions = pokemonGens.map((gen) => ({
  value: gen,
  label: `Gen ${gen}`,
}))

const styleOptions = [
  { value: "2d", label: "2D" },
  { value: "3d", label: "3D" },
]
const sortOptions = [
  { value: "createdAt", label: "Newest" },
  { value: "likes", label: "Likes" },
]

module.exports = {
  typeOptions,
  genOptions,
  styleOptions,
  typeColors,
  gradientColors,
  sortOptions,
}
