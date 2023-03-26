import "./cardBack.css"
import { Text, Center, Box, Flex, useColorModeValue } from "@chakra-ui/react"

const CardBack = ({ fakemon }) => {
  const bg = useColorModeValue(
    "linear(to-b,#e5d5e5, #d5f5e3,#d5f5d5)",
    "linear(to-b,#5c258d, #4389a2,#5dffff)"
  )

  const rareStyle = {
    boxShadow: `0px 1px 109px 4px rgba(202,209,77,1)`,
    WebkitBoxShadow: "0px 1px 109px 4px rgba(202,209,77,1)",
    MozBoxShadow: "0px 1px 109px 4px rgba(202,209,77,1)",
  }
  const uncommonStyle = {
    boxShadow: `0px 0px 70px -5px rgba(229,232,178,1)`,
    WebkitBoxShadow: "0px 0px 70px -5px rgba(229,232,178,1)",
    MozBoxShadow: "0px 0px 70px -5px rgba(229,232,178,1)",
  }

  return (
    <Center>
      <Box
        className="card-back"
        bgGradient={bg}
        _hover={{
          cursor: "pointer",
        }}
        style={
          fakemon.rarity && fakemon.rarity === "Rare"
            ? rareStyle
            : fakemon.rarity && fakemon.rarity === "Uncommon"
            ? uncommonStyle
            : {}
        }
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
