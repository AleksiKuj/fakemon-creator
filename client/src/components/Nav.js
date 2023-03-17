import { Center, Link, Stack, IconButton, useColorMode } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"

const Nav = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Center py={3}>
      <Stack direction="row" gap={5} alignItems="center">
        <Link as={RouterLink} to="/createpokemon">
          Create new Pokemon
        </Link>
        <Link as={RouterLink} to="/">
          View all Pokemon
        </Link>
        <IconButton
          aria-label="Toggle darkmode"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          bg="transparent"
          onClick={toggleColorMode}
        />
      </Stack>
    </Center>
  )
}
export default Nav
