import { Box, useColorModeValue,Text } from "@chakra-ui/react"

const Footer = () => {
  const bg = useColorModeValue("blue.500", "purple.300")
  const color = useColorModeValue("white", "gray.800")
  return (
    <Box bg={bg} py="5" textColor={color} textAlign="center" fontSize="sm">
      <Text>
      © 2023, Fakémon. No copyright or trademark infringement is intended in
      using Pokémon content.
      </Text>
      <b><a href="https://github.com/AleksiKuj" target="_blank" rel="noreferrer">github.com/AleksiKuj</a></b>
    </Box>
  )
}
export default Footer
