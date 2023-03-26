import {
  Center,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorModeValue,
} from "@chakra-ui/react"

const UserForm = ({
  username,
  setUsername,
  password,
  setPassword,
  handleSubmit,
  buttonText,
}) => {
  const buttonColorScheme = useColorModeValue("blue", "purple")
  const borderColor = useColorModeValue("blue.500", "purple.500")

  return (
    <Center py={5} maxW="90vw">
      <Box w="lg">
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              borderColor={borderColor}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              borderColor={borderColor}
            />
          </FormControl>
          <Center py={5}>
            <Button
              colorScheme={buttonColorScheme}
              type="submit"
              isDisabled={username && password ? false : true}
            >
              {buttonText}
            </Button>
          </Center>
        </form>
      </Box>
    </Center>
  )
}

export default UserForm
