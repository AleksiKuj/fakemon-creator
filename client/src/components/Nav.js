import { Center, Link, Stack, IconButton, useColorMode } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"

const Nav = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Center py={3}>
      <Stack direction="row" gap={5} alignItems="center">
        <Link as={RouterLink} to="/createpokemon">
          Create new Fakémon
        </Link>
        <Link as={RouterLink} to="/">
          View all creations
        </Link>
        <IconButton
          aria-label="Toggle darkmode"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          bg="transparent"
          color={colorMode === "light" ? "purple.500" : "blue.400"}
          onClick={toggleColorMode}
        />
      </Stack>
    </Center>
  )
}
export default Nav
