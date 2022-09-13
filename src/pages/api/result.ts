import { NextApiRequest, NextApiResponse } from "next"
import { deleteAllMatches, getAllMatchesWithTeams } from "../../backend/match"
import { computeResults } from "../../backend/result"
import { deleteAllTeams } from "../../backend/team"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      await handleGetResults(req, res)
      break
    case "DELETE":
      await handleReset(req, res)
      break
  }
}

async function handleGetResults(req: NextApiRequest, res: NextApiResponse) {
  try {
    const results = await computeResults()
    res.status(200).json({
      success: true,
      results
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({
      success: false,
      error: "An unknown error occured"
    })
  }
}

async function handleReset(req: NextApiRequest, res: NextApiResponse) {
  try {
    await deleteAllMatches().then(() => deleteAllTeams())
    res.status(200).json({
      success: true,
      results: {
        groupOne: [],
        groupTwo: []
      }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({
      success: false,
      error: "An unknown error occured"
    })
  }
}
