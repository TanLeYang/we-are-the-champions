import { Box, Flex, Heading, VStack, Text, Textarea, Spacer, Button } from "@chakra-ui/react"
import type { NextPage } from "next"
import { useState } from "react"
import ResultTable from "../components/ResultTable"
import { Result } from "../types/result"

const Home: NextPage = () => {
  const [teamRegistrationText, setTeamRegistrationText] = useState("")
  const [matchesText, setMatchesText] = useState("")
  const [groupOneResults, setGroupOneResults] = useState<Result[]>([])
  const [groupTwoResults, setGroupTwoResults] = useState<Result[]>([])

  const handleRegisterTeams = async () => {
    const teamsToRegister = teamRegistrationText
      .trim()
      .split("\n")
      .map((line) => {
        const [name, registrationDateStr, group] = line.split(" ")
        return {
          name,
          registrationDateStr,
          group
        }
      })

    await fetch("/api/team", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(teamsToRegister)
    })
  }

  const handleSubmitMatches = async () => {
    const matchesToSubmit = matchesText
      .trim()
      .split("\n")
      .map((line) => {
        const [firstTeamName, secondTeamName, firstTeamGoalsScored, secondTeamGoalsScored] =
          line.split(" ")
        return {
          firstTeamName,
          secondTeamName,
          firstTeamGoalsScored: parseInt(firstTeamGoalsScored),
          secondTeamGoalsScored: parseInt(secondTeamGoalsScored)
        }
      })

    const resp = await fetch("/api/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(matchesToSubmit)
    }).then((resp) => resp.json())

    const { results } = resp
    setGroupOneResults(results.groupOne)
    setGroupTwoResults(results.groupTwo)
  }

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
              value={teamRegistrationText}
              onChange={(e) => setTeamRegistrationText(e.target.value)}
              size="md"
              placeholder="Each line: <Team Name> <Registration Date> <Group Number>"
            />
            <Flex>
              <Spacer />
              <Button colorScheme="green" onClick={handleRegisterTeams}>
                Register
              </Button>
            </Flex>
          </VStack>
          <VStack alignItems="leading">
            <Text> Input Results: </Text>
            <Textarea
              value={matchesText}
              onChange={(e) => setMatchesText(e.target.value)}
              size="md"
              placeholder="Each line: <Team A Name> <Team B Name> <Team A goals scored> <Team B goals scored>"
            />
            <Flex>
              <Spacer />
              <Button colorScheme="blue" onClick={handleSubmitMatches}>
                Submit Results
              </Button>
            </Flex>
          </VStack>
        </Box>

        <Flex direction="column" gap="3vh">
          <ResultTable results={groupOneResults} />
          <ResultTable results={groupTwoResults} />
        </Flex>
      </Flex>
    </>
  )
}

export default Home
