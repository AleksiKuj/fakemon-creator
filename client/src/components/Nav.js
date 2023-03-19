import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  useToast,
} from "@chakra-ui/react"
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons"

import { Link as RouterLink, useNavigate } from "react-router-dom"

const Nav = ({ user, setUser }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const navigate = useNavigate()
  const { colorMode, toggleColorMode } = useColorMode()

  const hoverBg = useColorModeValue("rgba(200, 200, 200, 0.5)", "purple.600")
  const bg = useColorModeValue("rgba(0, 0, 0, 0.04)", "transparent")

  const handleLogout = () => {
    localStorage.removeItem("fakemonUser")
    setUser("")
    navigate("/")
    toast({
      position: "top",
      title: `Logged out`,
      status: "success",
      isClosable: true,
      duration: 3000,
    })
  }

  return (
    <>
      <Box bg="transparent" px={4} fontWeight="semibold">
        <Flex
          h={16}
          alignItems={"center"}
          justifyContent={["start", "start", "center"]}
        >
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              <Link
                as={RouterLink}
                to="/createfakemon"
                _hover={{
                  background: hoverBg,
                }}
                p={2}
                borderRadius="md"
              >
                Create
              </Link>
              <Link
                as={RouterLink}
                to="/"
                _hover={{
                  background: hoverBg,
                }}
                p={2}
                borderRadius="md"
              >
                View all
              </Link>
              {user ? (
                <Button
                  onClick={handleLogout}
                  _hover={{
                    background: hoverBg,
                  }}
                  bg="transparent"
                  p={2}
                  borderRadius="md"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Link
                    as={RouterLink}
                    to="/login"
                    _hover={{
                      background: hoverBg,
                    }}
                    p={2}
                    borderRadius="md"
                  >
                    Sign in
                  </Link>
                  <Link
                    as={RouterLink}
                    to="/register"
                    _hover={{
                      background: hoverBg,
                    }}
                    p={2}
                    borderRadius="md"
                  >
                    Sign up
                  </Link>
                </>
              )}
              <IconButton
                aria-label="Toggle darkmode"
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                bg="transparent"
                color={colorMode === "light" ? "purple.500" : "blue.400"}
                onClick={toggleColorMode}
              />
            </HStack>
          </HStack>
        </Flex>

        {isOpen ? (
          <Box
            display={{ md: "none" }}
            bg={bg}
            borderRadius="md"
            textAlign="center"
            onClick={onClose}
          >
            <Stack as={"nav"} spacing={4}>
              <Link
                as={RouterLink}
                to="/createfakemon"
                _hover={{
                  background: hoverBg,
                }}
                p={2}
                borderRadius="md"
              >
                Create
              </Link>
              <Link
                as={RouterLink}
                to="/"
                _hover={{
                  background: hoverBg,
                }}
                p={2}
                borderRadius="md"
              >
                View all creations
              </Link>
              {user ? (
                <Button
                  onClick={handleLogout}
                  _hover={{
                    background: hoverBg,
                  }}
                  bg="transparent"
                  p={2}
                  borderRadius="md"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Link
                    as={RouterLink}
                    to="/login"
                    _hover={{
                      background: hoverBg,
                    }}
                    p={2}
                    borderRadius="md"
                  >
                    Sign in
                  </Link>
                  <Link
                    as={RouterLink}
                    to="/register"
                    _hover={{
                      background: hoverBg,
                    }}
                    p={2}
                    borderRadius="md"
                  >
                    Sign up
                  </Link>
                </>
              )}
              <IconButton
                aria-label="Toggle darkmode"
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                bg="transparent"
                color={colorMode === "light" ? "purple.500" : "blue.400"}
                onClick={toggleColorMode}
              />
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  )
}
export default Nav
