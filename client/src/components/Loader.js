import {
  Center,
  Spinner,
} from "@chakra-ui/react"
const Loader = ()=>{
  return(
    <Center>
      <Spinner
        thickness="10px"
        speed="0.8s"
        emptyColor="red.600"
        color="blue.600"
        size="xl"
      />
    </Center>
  )
}
export default Loader