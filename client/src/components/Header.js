import {
  Heading,
  useColorModeValue,
  Center,
  Link,
  Stack,
  IconButton,
  useColorMode,
} from "@chakra-ui/react"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"
const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const color = useColorModeValue("blue.500", "purple.300")

  return (
    <Heading color={color} textAlign={"center"}>
      Fakémon{" "}
      <IconButton
        aria-label="Toggle darkmode"
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        bg="transparent"
        color={colorMode === "light" ? "purple.500" : "blue.400"}
        onClick={toggleColorMode}
      />
    </Heading>
  )
}
export default Header
