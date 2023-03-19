import { Center, Text, Stack, useToast, Heading } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import userService from "../services/users"
import UserForm from "./UserForm"

const Register = ({ setUser }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()
  const toast = useToast()

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
      setUser(response)
      navigate("/")
      toast({
        position: "top",
        title: `Registered and logged in as ${credentials.username}`,
        status: "success",
        isClosable: true,
        duration: 3000,
      })
    } catch (error) {
      console.log("login error", error)
      toast.closeAll()
      toast({
        position: "top",
        title: `Error`,
        description: "Internal server error :( Try again later",
        status: "error",
        isClosable: true,
        duration: 5000,
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const credentials = {
      username,
      password,
    }
    const register = async (credentials) => {
      try {
        const response = await userService.register(credentials)
        if (response === "user already exists") {
          toast.closeAll()
          toast({
            position: "top",
            title: `Error`,
            description: "User already exists",
            status: "error",
            isClosable: true,
            duration: 4000,
          })
          return
        }
        login(credentials)
      } catch (error) {
        console.log("login error", error)
        toast.closeAll()
        if (error && error.response && error.response.data) {
          toast({
            position: "top",
            title: `Error`,
            description: error.response.data,
            status: "error",
            isClosable: true,
            duration: 4000,
          })
        } else {
          toast({
            position: "top",
            title: `Error`,
            description: "Unknown error while signing up",
            status: "error",
            isClosable: true,
            duration: 4000,
          })
        }
      }
    }

    register(credentials)
  }

  //redirect if user is logged in
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("fakemonUser")
    if (loggedUserJSON) {
      navigate("/")
    }
  }, [])
  return (
    <Center py={5}>
      <Stack>
        <Heading as="h2" textAlign="center" fontSize="2xl">
          Sign Up
        </Heading>
        <UserForm
          handleSubmit={handleSubmit}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          buttonText="Sign Up"
        />
      </Stack>
    </Center>
  )
}

export default Register
