import "./pokemonCard.css"
import { gradientColors } from "../utils/selectOptions"
import { Spinner, Center, Box, Stack, Text } from "@chakra-ui/react"

const PokemonCard = ({ pokemon, loading }) => {
  const ability = {
    name: pokemon.ability.slice(0, pokemon.ability.indexOf("-")),
    description: pokemon.ability.slice(pokemon.ability.indexOf("-") + 1),
  }

  const rareStyle = {
    boxShadow: `0px 1px 109px 4px rgba(202,209,77,1)`,
    WebkitBoxShadow: "0px 1px 109px 4px rgba(202,209,77,1)",
    MozBoxShadow: "0px 1px 109px 4px rgba(202,209,77,1)",
  }
  const uncommonStyle = {
    boxShadow: `0px 0px 70px -5px rgba(229,232,178,1)`,
    WebkitBoxShadow: "0px 0px 70px -5px rgba(229,232,178,1)",
    MozBoxShadow: "0px 0px 70px -5px rgba(229,232,178,1)",
  }

  return (
    <Center w={["330px"]} margin="auto" color="black">
      {loading ? (
        <Spinner
          thickness="10px"
          speed="0.8s"
          emptyColor="red.600"
          color="blue.600"
          size="xl"
        />
      ) : (
        <Box
          className="pokemon-card"
          bgGradient={`radial${gradientColors[pokemon.type]}`}
          _hover={{
            boxShadow: "dark-lg",
          }}
          style={
            pokemon.rarity && pokemon.rarity === "Rare"
              ? rareStyle
              : pokemon.rarity && pokemon.rarity === "Uncommon"
              ? uncommonStyle
              : {}
          }
        >
          <div>
            <Stack direction="row" textAlign="center" alignItems="center">
              <Text className="pokemon-name">{pokemon.name} </Text>
              <img
                className="type-icon"
                src={require(`../images/${pokemon.type}.png`)}
                alt={pokemon.type}
                width="30px"
              />
              <Text fontWeight="semibold">
                {pokemon.rarity && pokemon.rarity}
              </Text>
              <Box direction="row" w="full">
                <Text float="right">{pokemon.pokemonStats.hp}HP</Text>
              </Box>
            </Stack>
          </div>
          <div className="pokemon-image">
            <img src={pokemon.imageUrl} alt={pokemon.name} />
          </div>
          <div className="pokemon-info">
            <b className="ability-name">{ability.name}</b>
            <p className="ability-description">{ability.description}</p>
            <p className="pokemon-bio">
              {pokemon.bio[0].toUpperCase() + pokemon.bio.slice(1)}
            </p>
          </div>
        </Box>
      )}
    </Center>
  )
}
export default PokemonCard
