import { Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import { Result } from "../types/result"

type ResultTableProps = {
  results: Result[]
  groupNumber: number
}

const ResultTable: React.FC<ResultTableProps> = ({ results, groupNumber }) => {
  return (
    <TableContainer>
      <Table variant="simple" colorScheme="teal">
        <TableCaption> {`Group ${groupNumber} results`} </TableCaption>
        <Thead>
          <Tr>
            <Th> Team Name </Th>
            <Th> Reg Date </Th>
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
              <Td> {result.registrationDate} </Td>
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
