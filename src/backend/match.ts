import { Prisma } from "@prisma/client"
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

const matchWithTeams = Prisma.validator<Prisma.MatchArgs>()({
  include: {
    firstTeam: true,
    secondTeam: true
  }
})

export type MatchWithTeams = Prisma.MatchGetPayload<typeof matchWithTeams>

export async function getAllMatchesWithTeams(): Promise<MatchWithTeams[]> {
  const matches = await prisma.match.findMany(matchWithTeams)
  return matches || []
}
