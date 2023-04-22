import "./fakemonCard.css"
import { gradientColors } from "../../utils/selectOptions"
import { Center, Box, Stack, Text, Flex, Image } from "@chakra-ui/react"
import Loader from "../Loader"

const FakemonCard = ({ fakemon, loading, thumbnail }) => {
  const ability = {
    name: fakemon.ability.slice(0, fakemon.ability.indexOf("-")),
    description: fakemon.ability.slice(fakemon.ability.indexOf("-") + 1),
  }

  const legendaryStyle = {
    boxShadow: "0px 2px 150px 8px rgba(202, 209, 77, 1.2)",
    WebkitBoxShadow: "0px 2px 150px 8px rgba(202, 209, 77, 1.2)",
    MozBoxShadow: "0px 2px 150px 8px rgba(202, 209, 77, 1.2)",
  }
  const rareStyle = {
    boxShadow: "0px 1px 109px 4px rgba(202,209,77,1)",
    WebkitBoxShadow: "0px 1px 109px 4px rgba(202,209,77,1)",
    MozBoxShadow: "0px 1px 109px 4px rgba(202,209,77,1)",
  }
  const uncommonStyle = {
    boxShadow: "0px 0px 70px -5px rgba(229,232,178,1)",
    WebkitBoxShadow: "0px 0px 70px -5px rgba(229,232,178,1)",
    MozBoxShadow: "0px 0px 70px -5px rgba(229,232,178,1)",
  }

  const style = (rarity)=>{
    if(rarity === "Uncommon"){
      return uncommonStyle
    } else if (rarity === "Rare"){
      return rareStyle 
    } else if (rarity === "Legendary"){
      return legendaryStyle
    } 
  }

  if (thumbnail) {
    return (
      <Center w={["150px", "150px"]} h={["150px", "150px"]} margin="auto">
        <Box
          className="thumbnail-fakemon-card"
          bg="transparent"
          _hover={{
            boxShadow: "dark-lg",
          }}
          style={style(fakemon.rarity)}
        >
          <div>
            <Stack
              direction="row"
              textAlign="center"
              alignItems="center"
              textTransform="uppercase"
            >
              <Text className="thumbnail-fakemon-name">{fakemon.name} </Text>
              <img
                className="thumbnail-type-icon"
                src={require(`../../images/${fakemon.type}.png`)}
                alt={fakemon.type}
              />
            </Stack>
          </div>

          <img
            className="thumbnail-fakemon-image"
            src={fakemon.imageUrl}
            alt={fakemon.name}
          />
        </Box>
      </Center>
    )
  }
  return (
    <Center w={["330px"]} margin="auto" color="black">
      {loading ? (
        <Loader/>
      ) : (
        <Box
          className="fakemon-card"
          bgGradient={`radial${gradientColors[fakemon.type]}`}
          _hover={{
            boxShadow: "dark-lg",
          }}
          style={style(fakemon.rarity)}
        >
          <div>
            <Stack
              direction="row"
              textAlign="center"
              alignItems="center"
              textTransform="uppercase"
            >
              <Text className="fakemon-name">{fakemon.name} </Text>

              <Image
                className="type-icon"
                src={require(`../../images/${fakemon.type}.png`)}
                alt={fakemon.type}
              />

              <Text fontSize="xs" style={{marginInlineStart:1}}>{fakemon.rarity && fakemon.rarity}</Text>
              <Box direction="row" w="full">
                <Text float="right" fontSize="sm" letterSpacing="0px">
                  {fakemon.stats.hp}HP
                </Text>
              </Box>
            </Stack>
          </div>
          <Center className="fakemon-image">
            <img src={fakemon.imageUrl} alt={fakemon.name} />
          </Center>
          <div className="fakemon-info">
            <b className="ability-name">{ability.name}</b>
            <p className="ability-description">{ability.description}</p>
            <Flex h="full" direction="column" justify="end">
              <p className="fakemon-bio">
                {fakemon.bio[0].toUpperCase() + fakemon.bio.slice(1)}
              </p>
            </Flex>
          </div>
        </Box>
      )}
    </Center>
  )
}
export default FakemonCard
