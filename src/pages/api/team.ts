import type { NextApiRequest, NextApiResponse } from "next"
import { computeResults } from "../../backend/result"
import { createTeams } from "../../backend/team"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      await handleCreateTeams(req, res)
      break
  }
}

type TeamToCreate = {
  name: string
  group: string
  registrationDateStr: string
}

async function handleCreateTeams(req: NextApiRequest, res: NextApiResponse) {
  const teamsToCreate: TeamToCreate[] = req.body

  try {
    const parsedTeams = teamsToCreate.map((team) => parseTeam(team))
    await createTeams(parsedTeams)
    const newestResults = await computeResults()
    return res.status(200).json({
      results: newestResults
    })
  } catch (e) {
    console.error(e)
    return res.status(400).json({
      error: "please check that input is correct"
    })
  }
}

function parseTeam(teamToCreate: TeamToCreate) {
  const [day, month] = teamToCreate.registrationDateStr.split("/").map((s) => parseInt(s))
  const year = new Date().getFullYear()
  const registrationDate = new Date(year, month - 1, day)

  return {
    name: teamToCreate.name,
    group: parseInt(teamToCreate.group),
    registrationDate
  }
}
