import {
  Box,
  Flex,
  Heading,
  VStack,
  Text,
  Textarea,
  Spacer,
  Button,
  useToast
} from "@chakra-ui/react"
import type { GetStaticProps, NextPage } from "next"
import React, { useState } from "react"
import { computeResults } from "../backend/result"
import ResultTable from "../components/ResultTable"
import { Result } from "../types/result"

type SuccessResponse = {
  success: true
  results: {
    groupOne: Result[]
    groupTwo: Result[]
  }
}

type ErrorResponse = {
  success: false
  error: string
}

type APIResponse = SuccessResponse | ErrorResponse

type Props = {
  initialGroupOneResults: Result[]
  initialGroupTwoResults: Result[]
}

const Home: NextPage<Props> = ({ initialGroupOneResults, initialGroupTwoResults }) => {
  const [teamRegistrationText, setTeamRegistrationText] = useState("")
  const [matchesText, setMatchesText] = useState("")
  const [groupOneResults, setGroupOneResults] = useState<Result[]>(initialGroupOneResults)
  const [groupTwoResults, setGroupTwoResults] = useState<Result[]>(initialGroupTwoResults)
  const [isLoadingResults, setIsLoadingResults] = useState(false)
  const errorToast = useToast()

  const postData = async (resource: string, data: any) => {
    try {
      const resp = (await fetch(`/api/${resource}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }).then((resp) => resp.json())) as APIResponse

      handleResponse(resp)
    } catch (e) {
      showGenericError()
    }
  }

  const handleResponse = (resp: APIResponse) => {
    switch (resp.success) {
      case true:
        setGroupOneResults(resp.results.groupOne)
        setGroupTwoResults(resp.results.groupTwo)
        break
      case false:
        showGenericError()
        break
    }
  }

  const showGenericError = () => {
    errorToast({
      title: "Oops, something went wrong. Please make sure all inputs are correct",
      status: "error",
      duration: 3000,
      isClosable: true
    })
  }

  const handleRegisterTeams = async () => {
    setIsLoadingResults(true)
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

    await postData("team", teamsToRegister)
    setIsLoadingResults(false)
  }

  const handleSubmitMatches = async () => {
    setIsLoadingResults(true)
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

    await postData("match", matchesToSubmit)
    setIsLoadingResults(false)
  }

  return (
    <Flex
      direction="row"
      justifyContent="center"
      alignItems="center"
      min-h="100vh"
      gap="10vw"
      wrap="wrap"
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
            <Button isLoading={isLoadingResults} colorScheme="green" onClick={handleRegisterTeams}>
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
            <Button isLoading={isLoadingResults} colorScheme="blue" onClick={handleSubmitMatches}>
              Submit Results
            </Button>
          </Flex>
        </VStack>
      </Box>

      <Flex direction="column" gap="3vh">
        <ResultTable results={groupOneResults} groupNumber={1} />
        <ResultTable results={groupTwoResults} groupNumber={2} />
      </Flex>
    </Flex>
  )
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const results = await computeResults()

  return {
    props: {
      initialGroupOneResults: results.groupOne,
      initialGroupTwoResults: results.groupTwo
    }
  }
}

export default Home
