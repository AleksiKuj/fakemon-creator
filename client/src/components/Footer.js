import { Box, useColorModeValue } from "@chakra-ui/react"

const Footer = () => {
  const bg = useColorModeValue("blue.500", "purple.300")
  const color = useColorModeValue("white", "gray.800")
  return (
    <Box bg={bg} py="5" textColor={color} textAlign="center">
      FOOTER
    </Box>
  )
}
export default Footer
