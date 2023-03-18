import { Center, Text, Stack, useToast } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import userService from "../services/users"
import UserForm from "./UserForm"

const Register = () => {
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
    const register = async (credentials) => {
      try {
        const response = await userService.register(credentials)
        console.log(response)
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
        navigate("/login")
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
        <Text textAlign="center" fontSize="2xl">
          Sign Up
        </Text>
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
