import { useState, useEffect } from "react"
import Select from "react-select"
import { styleOptions, genOptions, typeOptions } from "../utils/selectOptions"
import fakemonService from "../services/fakemon"
import { useNavigate } from "react-router-dom"
import {
  Button,
  Center,
  Flex,
  Box,
  Text,
  Stack,
  useColorModeValue,
  Heading,
  Checkbox,
} from "@chakra-ui/react"
import FakemonCard from "./card/FakemonCard"
import Loader from "./Loader"
import StatSlider from "./StatSlider"

const FakemonForm = ({
  setFakemon,
  fakemon,
  loading,
  setLoading,
  user,
  setUser,
}) => {
  const [type, setType] = useState()
  const [gen, setGen] = useState()
  const [style, setStyle] = useState()
  const [isValid, setIsValid] = useState(false)
  const [intelligence, setIntelligence] = useState(50)
  const [aggression, setAggression] = useState(50)

  const [showAdvanced, setShowAdvanced] = useState(false)

  const [showIntelligenceTooltip, setShowIntelligenceTooltip] = useState(false)
  const [showAggressionTooltip, setShowAggressionTooltip] = useState(false)

  const color = useColorModeValue("blue.500", "purple.200")
  const buttonColorScheme = useColorModeValue("blue", "purple")

  const navigate = useNavigate()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("fakemonUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      fakemonService.setToken(user.token)
    }
  }, [setUser])

  useEffect(() => {
    setFakemon()
    document.title = "Create Fakémon"
  }, [])

  //validate form
  useEffect(() => {
    setIsValid(gen && style && type ? true : false)
  }, [gen, style, type])

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      let response
      setFakemon()

      //if advanced settings is on, send intelligence and aggression with request
      showAdvanced
        ? (response = await fakemonService.generateFakemon({
          type,
          gen,
          style,
          intelligence,
          aggression,
        }))
        : (response = await fakemonService.generateFakemon({
          type,
          gen,
          style,
        }))

      setFakemon(response)
      console.log(response)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const saveFakemon = async () => {
    setLoading(true)
    try {
      if (user) {
        const response = await fakemonService.saveFakemon(fakemon, user)
        navigate(`/fakemon/${response.id}`)
      } else {
        const response = await fakemonService.saveFakemon(fakemon)
        navigate(`/fakemon/${response.id}`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Heading
        fontSize="xl"
        fontWeight="semibold"
        textAlign={"center"}
        color={color}
        pb="5"
        as="h2"
      >
        Build Your Own Fakémon
      </Heading>
      <form onSubmit={handleSubmit}>
        <Flex
          direction={"row"}
          textAlign="center"
          color="black"
          alignItems="center"
         
        >
          <Box w={"50%"}  zIndex="dropdown">
            <Select
              options={typeOptions}
              onChange={(e) => setType(e.value)}
              noOptionsMessage={() => null}
              clearValueOnReset={false}
              placeholder={type ? type : "Type"}
              required
              isSearchable={false}
            />
          </Box>
          <Box w={"50%"}  zIndex="dropdown">
            <Select
              options={genOptions}
              onChange={(e) => setGen(e.value)}
              noOptionsMessage={() => null}
              clearValueOnReset={false}
              placeholder={gen ? gen : "Gen"}
              isSearchable={false}
            />
          </Box>
          <Box w={"50%"}  zIndex="dropdown">
            <Select
              options={styleOptions}
              onChange={(e) => setStyle(e.value)}
              noOptionsMessage={() => null}
              clearValueOnReset={false}
              placeholder={style ? style : "Style"}
              isSearchable={false}
              name="style-select"
              id="style-select"
            />
          </Box>
        </Flex>
        <Box w={"100%"} pt={2}>
          <Flex direction="col" justifyContent="center">
            <Checkbox
              size="lg"
              onChange={(e) => setShowAdvanced(e.target.checked)}
              colorScheme={useColorModeValue("blue", "purple")}
              borderColor={color}
              isDisabled={loading ? true : false}
            >
              <Text fontSize="md">Advanced settings</Text>
            </Checkbox>
          </Flex>
        </Box>
        {showAdvanced && (
          <Flex gap={5}>
            {/* intelligence slider */}
            <Box w="50%">
              <StatSlider  onChange={(v) => setIntelligence(v)}
                onMouseEnter={() => setShowIntelligenceTooltip(true)}
                onMouseLeave={() => setShowIntelligenceTooltip(false)}
                loading={loading}
                isOpen={showIntelligenceTooltip}
                tooltipLabel={intelligence} 
                formLabel="Intelligence"
                colorScheme="blue" />
            </Box>
            {/* aggression slider */}
            <Box w="50%">
              <StatSlider  onChange={(v) => setAggression(v)}
                onMouseEnter={() => setShowAggressionTooltip(true)}
                onMouseLeave={() => setShowAggressionTooltip(false)}
                loading={loading}
                isOpen={showAggressionTooltip}
                tooltipLabel={aggression} 
                formLabel="Aggression"
                colorScheme="red" />
            </Box>
          </Flex>
        )}
        <Center py="4">
          <Button
            type="submit"
            colorScheme={buttonColorScheme}
            isDisabled={loading || !isValid ? true : false}
          >
            {fakemon ? "Create new" : "Create"}
          </Button>
        </Center>
      </form>
      <Center>
        {loading && (
          <>
            <Stack alignItems="center">
              <Loader/>
              <Text> Generating unique Fakémon... </Text>
              <Text>
               If this takes more than a minute, please refresh the page and
                try again as the servers might be busy.
              </Text>
            </Stack>
          </>
        )}
        {fakemon && !loading && (
          <Stack gap={3}>
            <div id="save">
              <FakemonCard fakemon={fakemon} />
            </div>
            <Stack gap={0}>
              <Button
                colorScheme={buttonColorScheme}
                onClick={() => saveFakemon()}
              >
                Save Fakemon
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
export default FakemonForm
