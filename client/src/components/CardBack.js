import "./cardBack.css"
import { gradientColors } from "../utils/selectOptions"
import { Text, Center, Box, Flex, useColorModeValue } from "@chakra-ui/react"

const CardBack = ({ pokemon, loading }) => {
  const bg = useColorModeValue(
    "linear(to-b,#f5d5e5, #d5f5e3,#e5f5d5)",
    "linear(to-b,#5c258d, #4389a2,#5dffff)"
  )
  return (
    <Center>
      <Box
        className="card-back"
        bgGradient={bg}
        _hover={{
          boxShadow: "dark-lg",
          cursor: "pointer",
        }}
      >
        <Flex justifyContent="center" alignItems="center" h="100%">
          <Text fontWeight="bold" fontSize="2xl" textTransform="uppercase">
            Click to reveal
          </Text>
        </Flex>
      </Box>
    </Center>
  )
}
export default CardBack
