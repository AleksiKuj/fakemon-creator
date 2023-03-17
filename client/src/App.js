import PokemonForm from "./components/PokemonForm"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Nav from "./components/Nav"
import PokemonList from "./components/PokemonList"
import { useState } from "react"
import { Container, Flex, Box, useColorMode, Button } from "@chakra-ui/react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  const [loading, setLoading] = useState(false)
  const [pokemon, setPokemon] = useState()
  const [darkMode, setDarkMode] = useState(false)
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box>
      <Router>
        <Flex direction="column" minH="100vh">
          <Container maxW="container.xl">
            <Header />
            <header>
              <Button onClick={toggleColorMode}>
                Toggle {colorMode === "light" ? "Dark" : "Light"}
              </Button>
            </header>
            <Nav />
            <Routes>
              <Route path="/" element={<PokemonList />} />
              <Route
                path="/createpokemon"
                element={
                  <PokemonForm
                    setPokemon={setPokemon}
                    pokemon={pokemon}
                    loading={loading}
                    setLoading={setLoading}
                  />
                }
              />
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
