import { Heading, useColorModeValue } from "@chakra-ui/react"
const Header = () => {
  const color = useColorModeValue("blue.500", "purple.300")

  return (
    <Heading color={color} textAlign={"center"} fontSize="4xl">
      Fakémon
    </Heading>
  )
}
export default Header
