import { Center, Link, Stack, Button } from "@chakra-ui/react"
import { Link as RouterLink, useNavigate } from "react-router-dom"

const Nav = ({ user, setUser }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("fakemonUser")
    setUser("")
    navigate("/")
  }

  return (
    <Center pt={3}>
      <Stack direction={["column", "row"]} gap={[1, 5]} alignItems="center">
        <Link
          as={RouterLink}
          to="/createpokemon"
          _hover={{
            fontSize: "lg",
            textDecoration: "underline",
          }}
        >
          Create new Fakémon
        </Link>
        <Link
          as={RouterLink}
          to="/"
          _hover={{
            fontSize: "lg",
            textDecoration: "underline",
          }}
        >
          View all creations
        </Link>

        {user ? (
          <Button onClick={handleLogout}>LOGOUT</Button>
        ) : (
          <>
            <Link
              as={RouterLink}
              to="/login"
              _hover={{
                fontSize: "lg",
                textDecoration: "underline",
              }}
            >
              Login
            </Link>
            <Link
              as={RouterLink}
              to="/register"
              _hover={{
                fontSize: "lg",
                textDecoration: "underline",
              }}
            >
              Sign up
            </Link>
          </>
        )}
      </Stack>
    </Center>
  )
}
export default Nav
