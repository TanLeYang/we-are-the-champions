import { Team } from "@prisma/client"
import { MatchWithTeams } from "./match"

export async function computeResults(allMatches: MatchWithTeams[]) {
  const groupOneMatches = allMatches.filter((m) => m.firstTeam.group == 1)
  const groupTwoMatches = allMatches.filter((m) => m.firstTeam.group == 2)

  const groupOneResults = computeGroupResults(groupOneMatches)
  const groupTwoResults = computeGroupResults(groupTwoMatches)

  return {
    groupOne: groupOneResults,
    groupTwo: groupTwoResults
  }
}

type TeamStats = {
  teamName: string
  points: number
  totalGoals: number
  alternatePoints: number
  registrationDate: Date
}

function computeGroupResults(groupMatches: MatchWithTeams[]) {
  const teamStats: Map<string, TeamStats> = new Map()

  const pointsEarned = (goalsScored: number, opponentGoalsScored: number, alternate: boolean) => {
    if (goalsScored > opponentGoalsScored) {
      return alternate ? 5 : 3
    } else if (goalsScored == opponentGoalsScored) {
      return alternate ? 3 : 1
    } else {
      return alternate ? 1 : 0
    }
  }

  const updateStats = (team: Team, goalsScored: number, opponentGoalsScored: number) => {
    let stats = teamStats.get(team.name) || {
      teamName: team.name,
      points: 0,
      totalGoals: 0,
      alternatePoints: 0,
      registrationDate: team.registrationDate
    }

    stats.points += pointsEarned(goalsScored, opponentGoalsScored, false)
    stats.alternatePoints += pointsEarned(goalsScored, opponentGoalsScored, true)
    stats.totalGoals += goalsScored
    teamStats.set(team.name, stats)
  }

  groupMatches?.forEach((match) => {
    updateStats(match.firstTeam, match.firstTeamGoalsScored, match.secondTeamGoalsScored)
    updateStats(match.secondTeam, match.secondTeamGoalsScored, match.firstTeamGoalsScored)
  })

  let allStats = Array.from(teamStats.values())
  allStats.sort((firstTeamStats, secondTeamStats) => {
    if (firstTeamStats.points !== secondTeamStats.points) {
      return firstTeamStats.points - secondTeamStats.points
    } else if (firstTeamStats.totalGoals !== secondTeamStats.totalGoals) {
      return firstTeamStats.totalGoals - secondTeamStats.totalGoals
    } else if (firstTeamStats.alternatePoints !== secondTeamStats.alternatePoints) {
      return firstTeamStats.alternatePoints - secondTeamStats.alternatePoints
    } else {
      return firstTeamStats.registrationDate < secondTeamStats.registrationDate ? -1 : 1
    }
  })

  return allStats
}
