import { Heading, useColorModeValue, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import counterService from "../services/counter"
const Header = () => {
  const [count, setCount] = useState(0)
  const color = useColorModeValue("blue.500", "purple.300")

  useEffect(()=>{
    const getCount = async () => {
      try {
        const response = await counterService.getCount()
        setCount(response.count)
      } catch (error) {
        console.log(error)
      }
    }
    getCount()
  },[])

  return (
    <>
      <Heading as="h1" color={color} textAlign={"center"} fontSize="4xl">
      Fakémon
      </Heading>
      <Text textAlign="center">{count} Total Unique Fakémon Created!</Text>
    </>
  )
}
export default Header
