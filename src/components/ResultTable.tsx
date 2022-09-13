import { Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"

type Results = {
  teamName: string
  wins: number
  draws: number
  losses: number
  points: number
  goalsScored: number
  alternatePoints: number
  didAdvance: boolean
}

type ResultTableProps = {
  results: Results[]
}

const ResultTable: React.FC<ResultTableProps> = ({ results }) => {
  return (
    <TableContainer>
      <Table variant="simple" colorScheme="teal">
        <TableCaption> Group X results </TableCaption>
        <Thead>
          <Tr>
            <Th> Team Name </Th>
            <Th> W </Th>
            <Th> D </Th>
            <Th> L </Th>
            <Th> Pts </Th>
            <Th> Goals Scored </Th>
            <Th> Alt Pts </Th>
          </Tr>
        </Thead>
        <Tbody>
          {results.map((result, idx) => (
            <Tr key={idx} bgColor={result.didAdvance ? "teal" : ""}>
              <Td> {result.teamName} </Td>
              <Td> {result.wins} </Td>
              <Td> {result.draws} </Td>
              <Td> {result.losses} </Td>
              <Td> {result.points} </Td>
              <Td> {result.goalsScored} </Td>
              <Td> {result.alternatePoints} </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default ResultTable
