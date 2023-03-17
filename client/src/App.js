import PokemonForm from "./components/PokemonForm"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Nav from "./components/Nav"
import PokemonList from "./components/PokemonList"
import NotFound from "./components/NotFound"
import { useState } from "react"
import { Container, Flex, Box, useColorModeValue } from "@chakra-ui/react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import PokemonView from "./components/PokemonView"

function App() {
  const [loading, setLoading] = useState(false)
  const [pokemon, setPokemon] = useState()

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

            <Nav />
            <Routes>
              <Route path="/" element={<PokemonList />} />
              <Route path="/pokemon/:id" element={<PokemonView />} />
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
