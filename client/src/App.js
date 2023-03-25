import FakemonForm from "./components/FakemonForm"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Nav from "./components/Nav"
import FakemonList from "./components/FakemonList"
import NotFound from "./components/NotFound"
import FakemonView from "./components/FakemonView"
import Login from "./components/Login"
import Register from "./components/Register"
import Profile from "./components/Profile"
import { useState, useEffect } from "react"
import fakemonService from "./services/fakemon"
import tradeService from "./services/trade"
import { Container, Flex, Box, useColorModeValue } from "@chakra-ui/react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import TradeOffers from "./components/TradeOffers"

function App() {
  const [loading, setLoading] = useState(false)
  const [fakemon, setFakemon] = useState()
  const [user, setUser] = useState("")

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("fakemonUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      fakemonService.setToken(user.token)
      tradeService.setToken(user.token)
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
              <Route path="/" element={<FakemonList />} />
              <Route
                path="/fakemon/:id"
                element={<FakemonView user={user} />}
              />
              <Route
                path="/createfakemon"
                element={
                  <FakemonForm
                    setFakemon={setFakemon}
                    fakemon={fakemon}
                    loading={loading}
                    setLoading={setLoading}
                    user={user}
                    setUser={setUser}
                  />
                }
              />
              <Route path="/users/:id/profile" element={<Profile />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route
                path="/register"
                element={<Register setUser={setUser} />}
              />
              <Route
                path="/tradeoffers"
                element={<TradeOffers user={user} />}
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
