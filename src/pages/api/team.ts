import type { NextApiRequest, NextApiResponse } from "next"
import { createTeams } from "../../backend/team"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      handleCreateTeams(req, res)
      break
  }
}

type TeamToCreate = {
  name: string
  group: number
  registrationDateStr: string
}

async function handleCreateTeams(req: NextApiRequest, res: NextApiResponse) {
  const teamsToCreate: TeamToCreate[] = req.body

  try {
    const parsedTeams = teamsToCreate.map((team) => parseTeam(team))
    const createdTeams = await createTeams(parsedTeams)
    return res.status(200).json({
      success: true,
      teams: createdTeams
    })
  } catch (e) {
    return res.status(400).json({
      success: false,
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
    group: teamToCreate.group,
    registrationDate
  }
}
