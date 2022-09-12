import { prisma } from "../db/client"

type CreateMatch = {
  firstTeamId: number
  firstTeamGoalsScored: number
  secondTeamId: number
  secondTeamGoalsScored: number
}

export async function createMatches(matches: CreateMatch[]) {
  return prisma.$transaction(
    matches.map((match) =>
      prisma.match.create({
        data: match
      })
    )
  )
}
