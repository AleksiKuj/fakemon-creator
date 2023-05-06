import FakemonForm from "./components/FakemonForm"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Nav from "./components/Nav"
import FakemonList from "./components/FakemonList"
import NotFound from "./components/NotFound"
import FakemonView from "./components/FakemonView"
import Login from "./components/user/Login"
import Register from "./components/user/Register"
import Profile from "./components/user/Profile"
import { useState, useEffect } from "react"
import fakemonService from "./services/fakemon"
import tradeService from "./services/trade"
import battleService from "./services/battle"
import { Container, Flex, Box, useColorModeValue } from "@chakra-ui/react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import TradeOffers from "./components/trade/TradeOffers"
import BattleView from "./components/battle/BattleView"
import { isTokenExpired } from "./utils/isTokenExpired"

const AppContent = ({user, setUser}) => {
  const [loading, setLoading] = useState(false)
  const [fakemon, setFakemon] = useState()
  const location = useLocation()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("fakemonUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      const token = JSON.parse(loggedUserJSON).token
      if(isTokenExpired(token)) {
        localStorage.removeItem("fakemonUser")
        setUser("")
        return window.location.reload(false)
      } 
      fakemonService.setToken(user.token)
      tradeService.setToken(user.token)
      battleService.setToken(user.token)
    }
  }, [setUser])

  

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("fakemonUser")
    if (loggedUserJSON) {
      const token = JSON.parse(loggedUserJSON).token
      if(isTokenExpired(token)) {
        localStorage.removeItem("fakemonUser")
        setUser("")
        return window.location.reload(false)
      } 
    }
  }, [location.pathname])

  return (
    <>
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
        <Route
          path="/battle/:id"
          element={<BattleView />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

function App() {
  const [user, setUser] = useState("")

  const bgGradient = useColorModeValue(
    "linear(to-t,#e7d7e7 ,#e4f4d4)",
    "linear(to-t,#141E30#243B55)"
  )

  //set darkmode by default
  if (!localStorage.getItem("chakra-ui-color-mode")) {
    localStorage.setItem("chakra-ui-color-mode", "dark")
  }

  return (
    <Box bgGradient={bgGradient}>
      <Router>
        <Flex direction="column" minH="100vh">
          <Container maxW="container.xl">
            <Header />
            <Nav user={user} setUser={setUser} />
            <AppContent user={user} setUser={setUser} />
          </Container>
          <Flex grow="1"></Flex>
          <Footer />
        </Flex>
      </Router>
    </Box>
  )
}

export default App
