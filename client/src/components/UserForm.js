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

  return (
    <Center py={5}>
      <Box w="lg">
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input type="text" onChange={(e) => setUsername(e.target.value)} />

            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
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
