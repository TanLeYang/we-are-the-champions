import { NextApiRequest, NextApiResponse } from "next"
import { getAllMatchesWithTeams } from "../../backend/match"
import { computeResults } from "../../backend/result"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      handleGetResults(req, res)
      break
  }
}

async function handleGetResults(req: NextApiRequest, res: NextApiResponse) {
  try {
    const results = await getAllMatchesWithTeams().then((matches) => computeResults(matches))
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
