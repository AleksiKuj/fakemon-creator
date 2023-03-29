import { Tooltip, Icon, useColorModeValue } from "@chakra-ui/react"
import { AiOutlineTrophy } from "react-icons/ai"
import { useState } from "react"
const Badge = ({ name }) => {
  const [isLabelOpen, setIsLabelOpen] = useState(false)
  const trophyColor = useColorModeValue("blue.400", "gold")

  return (
    <Tooltip label={`${name}`} isOpen={isLabelOpen} >
      <span>
        <Icon as={AiOutlineTrophy} color={trophyColor} boxSize={10} onMouseEnter={() => setIsLabelOpen(true)}
                onMouseLeave={() => setIsLabelOpen(false)}
                onClick={() => setIsLabelOpen(!isLabelOpen)} />
      </span>
    </Tooltip>
  )
}
export default Badge
