import "./pokemonCard.css"
import { gradientColors } from "../utils/selectOptions"
import { Spinner, Center, Box } from "@chakra-ui/react"

const PokemonCard = ({ pokemon, loading }) => {
  const ability = {
    name: pokemon.ability.slice(0, pokemon.ability.indexOf("-")),
    description: pokemon.ability.slice(pokemon.ability.indexOf("-") + 1),
  }

  return (
    <Center w={["300px"]} margin="auto" color="black">
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
        >
          <div>
            <span className="pokemon-name">{pokemon.name}</span>
            <span className="pokemon-hp">{pokemon.pokemonStats.hp}HP</span>
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
