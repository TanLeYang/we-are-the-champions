import { prisma } from "../db/client"

type CreateTeam = {
  name: string
  group: number
  registrationDate: Date
}

export async function createTeams(teams: CreateTeam[]) {
  return prisma.$transaction(
    teams.map((team) =>
      prisma.team.create({
        data: team
      })
    )
  )
}

export async function deleteAllTeams() {
  return prisma.team.deleteMany({})
}

export async function getTeamByName(name: string) {
  return prisma.team.findUnique({
    where: {
      name: name
    }
  })
}

export async function getAllTeams() {
  return prisma.team.findMany()
}
