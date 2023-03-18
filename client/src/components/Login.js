import { Center, Text, Stack, useToast } from "@chakra-ui/react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import userService from "../services/users"
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
    console.log(credentials)
    const login = async (credentials) => {
      try {
        const response = await userService.login(credentials)
        if (response === "invalid username or password") {
          toast.closeAll()
          toast({
            position: "top",
            title: `Error`,
            description: "Invalid username or password",
            status: "error",
            isClosable: true,
            duration: 3000,
          })
          return
        }
        window.localStorage.setItem("fakemonUser", JSON.stringify(response))
        console.log(response)
        setUser(response)
        navigate("/")
      } catch (error) {
        console.log("login error", error)
        toast.closeAll()
        toast({
          position: "top",
          title: `Error`,
          description: "Invalid username or password",
          status: "error",
          isClosable: true,
          duration: 5000,
        })
      }
    }
    login(credentials)
  }
  return (
    <Center py={5}>
      <Stack>
        <Text textAlign="center" fontSize="2xl">
          Sign in
        </Text>
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
