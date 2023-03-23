import { useEffect, useState } from "react"
import fakemonService from "../services/fakemon"
import userService from "../services/users"
import FakemonCard from "./FakemonCard"
import {
  Box,
  Button,
  Text,
  SimpleGrid,
  Spinner,
  Center,
  useColorModeValue,
  Link,
  Flex,
  useToast,
} from "@chakra-ui/react"
import { CopyIcon } from "@chakra-ui/icons"
import { Link as RouterLink, useParams } from "react-router-dom"
import Select from "react-select"
import { sortOptions } from "../utils/selectOptions"
import Badge from "./Badge"

const Buttons = ({ changePage, page, totalPages }) => {
  const buttonColorScheme = useColorModeValue("blue", "purple")
  return (
    <Flex direction="row" gap={5} py={5} justifyContent="center" align="center">
      <Button
        colorScheme={buttonColorScheme}
        onClick={() => changePage("previous")}
        isDisabled={page === 1 ? true : false}
        w="5.5rem"
      >
        Previous
      </Button>
      <Text>Page {page}</Text>
      <Button
        colorScheme={buttonColorScheme}
        onClick={() => changePage("next")}
        isDisabled={page === totalPages ? true : false}
        w="5.5rem"
      >
        Next
      </Button>
    </Flex>
  )
}

const MyFakemon = () => {
  const [fakemons, setFakemons] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("createdAt")
  const [user, setUser] = useState(null)

  const { id } = useParams()
  const shareButtonColor = useColorModeValue("blue", "purple")
  const toast = useToast()
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied to clipboard.",
      status: "success",
      duration: 5000,
      isClosable: true,
    })
  }

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await userService.getUserData(id)
        setUser(response)
      } catch (error) {
        console.log(error)
      }
    }
    getUserData()
  }, [id])

  useEffect(() => {
    setLoading(true)

    const getFakemon = async () => {
      try {
        const response = await fakemonService.getAllFromUser(page, sortBy, id)
        setFakemons(response.fakemon)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    getFakemon()

    user
      ? (document.title = `Fakemon - ${user.username}'s profile`)
      : (document.title = "Fakemon")
  }, [page, sortBy, user])

  useEffect(() => {
    setPage(1)
  }, [sortBy])

  const changePage = (direction) => {
    if (direction === "previous" && page > 1) setPage(page - 1)
    if (direction === "next" && page < totalPages) setPage(page + 1)
  }

  if (!user) {
    return <Text textAlign="center">User not found</Text>
  }

  return (
    <Box py={5}>
      {fakemons.length === 0 ? (
        <Text textAlign="center" fontSize="xl" py={5}>
          Looks like this user has no Fakémon yet :(
        </Text>
      ) : (
        <>
          <Center>
            <Button
              leftIcon={<CopyIcon />}
              colorScheme={shareButtonColor}
              variant="ghost"
              _hover={{
                bg: "rgba(0, 0, 0, 0.09)",
              }}
              onClick={() => handleCopy()}
            >
              Share profile
            </Button>
          </Center>
          {/* badges */}
          <Flex justifyContent="center" direction="column" alignItems="center">
            <Text fontSize="lg"> {user.username}'s Badges</Text>
            {user.badges.length !== 0 ? (
              <Box>
                {user.badges.map((badge) => (
                  <Badge key={badge.name} name={badge.name} />
                ))}
              </Box>
            ) : (
              <Text>This user doesn't have any badges yet :(</Text>
            )}
          </Flex>

          <Buttons
            changePage={changePage}
            page={page}
            totalPages={totalPages}
          />
          <Center color="black" pb={5}>
            <Select
              options={sortOptions}
              onChange={(e) => setSortBy(e.value)}
              noOptionsMessage={() => null}
              clearValueOnReset={false}
              placeholder="Sort by"
            />
          </Center>

          {loading ? (
            <Center>
              <Spinner
                thickness="10px"
                speed="0.8s"
                emptyColor="red.600"
                color="blue.600"
                size="xl"
              />
            </Center>
          ) : (
            <SimpleGrid columns={[1, 1, 2, 3, 3, 4]} spacing={5}>
              {fakemons.map((fakemon) => (
                <Link
                  as={RouterLink}
                  to={`/fakemon/${fakemon.id}`}
                  key={fakemon.id}
                  px={0}
                  mx={0}
                  maxW="350px"
                  margin="auto"
                  _hover={{
                    textDecoration: "none",
                  }}
                >
                  <FakemonCard fakemon={fakemon} />
                </Link>
              ))}
            </SimpleGrid>
          )}
          <Buttons
            changePage={changePage}
            page={page}
            totalPages={totalPages}
          />
        </>
      )}
    </Box>
  )
}

export default MyFakemon
