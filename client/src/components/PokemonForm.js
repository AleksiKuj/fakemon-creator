import { useState, useEffect } from "react"
import Select from "react-select"
import { styleOptions, genOptions, typeOptions } from "../utils/selectOptions"
import pokemonService from "../services/pokemon"
import { useNavigate } from "react-router-dom"
import {
  Button,
  Center,
  Flex,
  Box,
  Text,
  Spinner,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import PokemonCard from "./PokemonCard"

const PokemonForm = ({ setPokemon, pokemon, loading, setLoading }) => {
  const [type, setType] = useState()
  const [gen, setGen] = useState()
  const [style, setStyle] = useState()
  const [isValid, setIsValid] = useState(false)

  const color = useColorModeValue("blue.500", "purple.200")
  const buttonColorScheme = useColorModeValue("blue", "purple")

  const navigate = useNavigate()

  useEffect(() => {
    setPokemon()
  }, [])

  //validate form
  useEffect(() => {
    setIsValid(gen && style && type ? true : false)
  }, [gen, style, type])

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      setPokemon()
      const response = await pokemonService.generatePokemon({
        type,
        gen,
        style,
      })
      setPokemon(response)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const savePokemon = async () => {
    setLoading(true)
    try {
      const response = await pokemonService.savePokemon(pokemon)
      navigate(`/pokemon/${response.id}`)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Text
        fontSize="xl"
        fontWeight="semibold"
        textAlign={"center"}
        color={color}
        pb="5"
      >
        Build Your Own Fakémon
      </Text>
      <form onSubmit={handleSubmit}>
        <Flex direction={"row"} textAlign="center" color="black">
          <Box w={"50%"}>
            <Select
              options={typeOptions}
              onChange={(e) => setType(e.value)}
              noOptionsMessage={() => null}
              clearValueOnReset={false}
              placeholder={type ? type : "Type"}
              required
            />
          </Box>
          <Box w={"50%"}>
            <Select
              options={genOptions}
              onChange={(e) => setGen(e.value)}
              noOptionsMessage={() => null}
              clearValueOnReset={false}
              placeholder={gen ? gen : "Gen"}
            />
          </Box>
          <Box w={"50%"}>
            <Select
              options={styleOptions}
              onChange={(e) => setStyle(e.value)}
              noOptionsMessage={() => null}
              clearValueOnReset={false}
              placeholder={style ? style : "Style"}
            />
          </Box>
        </Flex>
        <Center py="4">
          <Button
            type="submit"
            colorScheme={buttonColorScheme}
            isDisabled={loading || !isValid ? true : false}
          >
            {pokemon ? "Create new" : "Create"}
          </Button>
        </Center>
      </form>
      <Center>
        {loading && (
          <Spinner
            thickness="10px"
            speed="0.8s"
            emptyColor="red.600"
            color="blue.600"
            size="xl"
          />
        )}
        {pokemon && !loading && (
          <Stack gap={3}>
            <div id="save">
              <PokemonCard pokemon={pokemon} />
            </div>
            <Stack gap={0}>
              <Button
                colorScheme={buttonColorScheme}
                onClick={() => savePokemon()}
              >
                Save Pokemon
              </Button>
              <Text fontSize="sm" textAlign="center">
                Saving allows everyone to see your creation
              </Text>
            </Stack>
          </Stack>
        )}
      </Center>
    </div>
  )
}
export default PokemonForm
