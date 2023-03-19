import PokemonForm from "./components/PokemonForm"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Nav from "./components/Nav"
import PokemonList from "./components/PokemonList"
import NotFound from "./components/NotFound"
import PokemonView from "./components/PokemonView"
import Login from "./components/Login"
import Register from "./components/Register"
import { useState, useEffect } from "react"
import pokemonService from "./services/pokemon"
import { Container, Flex, Box, useColorModeValue } from "@chakra-ui/react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  const [loading, setLoading] = useState(false)
  const [pokemon, setPokemon] = useState()
  const [user, setUser] = useState("")

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("fakemonUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      pokemonService.setToken(user.token)
    }
  }, [setUser])

  const bgGradient = useColorModeValue(
    "linear(to-t,#e7d7e7 ,#e4f4d4)",
    "linear(to-t,#141E30#243B55)"
  )

  return (
    <Box bgGradient={bgGradient}>
      <Router>
        <Flex direction="column" minH="100vh">
          <Container maxW="container.xl">
            <Header />
            <Nav user={user} setUser={setUser} />
            <Routes>
              <Route path="/" element={<PokemonList />} />
              <Route
                path="/pokemon/:id"
                element={<PokemonView user={user} />}
              />
              <Route
                path="/createfakemon"
                element={
                  <PokemonForm
                    setPokemon={setPokemon}
                    pokemon={pokemon}
                    loading={loading}
                    setLoading={setLoading}
                  />
                }
              />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route
                path="/register"
                element={<Register setUser={setUser} />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
          <Flex grow="1"></Flex>
          <Footer />
        </Flex>
      </Router>
    </Box>
  )
}

export default App
