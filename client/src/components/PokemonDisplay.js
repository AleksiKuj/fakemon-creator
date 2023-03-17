import "./pokemonCard.css"
const PokemonDisplay = ({ pokemon }) => {
  const ability = {
    name: pokemon.ability.slice(0, pokemon.ability.indexOf("-")),
    description: pokemon.ability.slice(pokemon.ability.indexOf("-")),
  }

  return (
    <div>
      <h1>display</h1>
      {/* <div>
        <p>{pokemon.name}</p>
        <p>{pokemon.ability}</p>
        <p>{pokemon.type}</p>
        <img src={pokemon.imageUrl} alt={pokemon.name} />
      </div> */}
      <div className="pokemon-card">
        <h2 className="pokemon-name">{pokemon.name}</h2>
        <div className="pokemon-image">
          <img src={pokemon.imageUrl} alt={pokemon.name} />
        </div>
        {/* <p>{ability.name}</p> */}
        <div className="pokemon-info">
          <p className="pokemon-description">{pokemon.ability}</p>
        </div>
      </div>
    </div>
  )
}
export default PokemonDisplay
