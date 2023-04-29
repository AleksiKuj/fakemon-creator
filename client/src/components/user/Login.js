import { Center, Stack, useToast, Heading } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import userService from "../../services/users"
import UserForm from "./UserForm"

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    const credentials = {
      username,
      password,
    }
    const login = async (credentials) => {
      try {
        const response = await userService.login(credentials)
        if (response === "invalid username or password") {
          toast.closeAll()
          toast({
            position: "top",
            title: "Error",
            description: "Invalid username or password",
            status: "error",
            isClosable: true,
            duration: 3000,
          })
          return
        }
        window.localStorage.setItem("fakemonUser", JSON.stringify(response))
        setUser(response)
        navigate(0)
        navigate("/")
        toast({
          position: "top",
          title: `Logged in as ${credentials.username}`,
          status: "success",
          isClosable: true,
          duration: 3000,
        })
      } catch (error) {
        toast.closeAll()
        toast({
          position: "top",
          title: "Error",
          description: "Internal server error :( Try again later",
          status: "error",
          isClosable: true,
          duration: 5000,
        })
      }
    }
    login(credentials)
  }
  //redirect if user is logged in
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("fakemonUser")
    if (loggedUserJSON) {
      navigate("/")
    }
    document.title = "Fakémon - Sign In"
  }, [])

  return (
    <Center py={5}>
      <Stack>
        <Heading as="h2" textAlign="center" fontSize="2xl">
          Sign in
        </Heading>
        <UserForm
          handleSubmit={handleSubmit}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          buttonText="Login"
        />
      </Stack>
    </Center>
  )
}

export default Login
