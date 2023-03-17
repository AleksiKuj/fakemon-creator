import { Center, Link, Stack } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"

const Nav = () => {
  return (
    <Center py={3}>
      <Stack direction="row" gap={5}>
        <Link as={RouterLink} to="/createpokemon">
          Create new Pokemon
        </Link>
        <Link as={RouterLink} to="/">
          View all Pokemon
        </Link>
      </Stack>
    </Center>
  )
}
export default Nav
