import { NextApiRequest, NextApiResponse } from "next"
import { createMatches, getAllMatchesWithTeams } from "../../backend/match"
import { computeResults } from "../../backend/result"
import { getTeamByName } from "../../backend/team"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      await handleAddMatches(req, res)
      break
  }
}

type MatchToAdd = {
  firstTeamName: string
  secondTeamName: string
  firstTeamGoalsScored: number
  secondTeamGoalsScored: number
}

async function handleAddMatches(req: NextApiRequest, res: NextApiResponse) {
  const matchesToAdd: MatchToAdd[] = req.body
  console.log(matchesToAdd)
  const teams: Map<string, number> = new Map()

  const getTeamId = async (teamName: string) => {
    if (!teams.has(teamName)) {
      const team = await getTeamByName(teamName)
      teams.set(teamName, team?.id || -1)
    }

    return teams.get(teamName) as number
  }

  const parsedMatches = await Promise.all(
    matchesToAdd.map(async (match) => {
      const firstTeamId = await getTeamId(match.firstTeamName)
      const secondTeamId = await getTeamId(match.secondTeamName)
      if (firstTeamId === -1 || secondTeamId === -1) {
        res.status(400).json({
          success: false,
          error: "Non existent team name found, check input again"
        })
      }

      return {
        firstTeamId,
        secondTeamId,
        firstTeamGoalsScored: match.firstTeamGoalsScored,
        secondTeamGoalsScored: match.secondTeamGoalsScored
      }
    })
  )

  try {
    await createMatches(parsedMatches)
    const results = await getAllMatchesWithTeams().then((matches) => computeResults(matches))
    res.status(200).json({
      success: true,
      results
    })
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: "An unknown error occured"
    })
  }
}
