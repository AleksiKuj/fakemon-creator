import { Tooltip, Icon, useColorModeValue } from "@chakra-ui/react"
import { AiOutlineTrophy } from "react-icons/ai"
const Badge = ({ name }) => {
  const trophyColor = useColorModeValue("blue.400", "gold")

  return (
    <Tooltip label={`${name}`}>
      <span>
        <Icon as={AiOutlineTrophy} color={trophyColor} boxSize={10} />
      </span>
    </Tooltip>
  )
}
export default Badge
