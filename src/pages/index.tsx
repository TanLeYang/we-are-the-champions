import { Box, Flex, Heading, VStack, Text, Textarea, Spacer, Button } from "@chakra-ui/react"
import type { NextPage } from "next"

const Home: NextPage = () => {
  return (
    <>
      <Flex
        direction="row"
        justifyContent="center"
        alignItems="center"
        h="100vh"
        gap="10vw"
        wrap="wrap"
        bgColor="blackAlpha.50"
      >
        <Box>
          <VStack alignItems="leading" marginBottom="10">
            <Heading> We are the Champions ⚽ </Heading>
            <Text> 12 teams compete for the grand prize of honour and glory </Text>
          </VStack>
          <VStack alignItems="leading" marginBottom="5">
            <Text> Register Teams: </Text>
            <Textarea
              size="md"
              placeholder="Each line: <Team Name> <Registration Date> <Group Number>"
            />
            <Flex>
              <Spacer />
              <Button colorScheme="green"> Register </Button>
            </Flex>
          </VStack>
          <VStack alignItems="leading">
            <Text> Input Results: </Text>
            <Textarea
              size="md"
              placeholder="Each line: <Team A Name> <Team B Name> <Team A goals scored> <Team B goals scored>"
            />
            <Flex>
              <Spacer />
              <Button colorScheme="blue"> Submit Results </Button>
            </Flex>
          </VStack>
        </Box>

        <Flex direction="column" gap="3vh">
          <h1> Hello </h1>
          <h1> Hello too </h1>
        </Flex>
      </Flex>
    </>
  )
}

export default Home
