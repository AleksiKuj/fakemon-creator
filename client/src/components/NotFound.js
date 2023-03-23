import { Flex, Text, Image } from "@chakra-ui/react"

export default function NotFound() {
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" py={5}>
      <Text pb={5}>Oops! Page not found :(</Text>
      <Image
        src={require("../images/404.png")}
        boxSize="sm"
        borderRadius="full"
        alt="water fakemon"
      />
    </Flex>
  )
}
