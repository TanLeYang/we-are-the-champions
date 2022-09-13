import { NextApiRequest, NextApiResponse } from "next"
import { getAllMatchesWithTeams } from "../../backend/match"
import { computeResults } from "../../backend/result"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      await handleGetResults(req, res)
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
