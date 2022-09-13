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
  wins: number
  draws: number
  losses: number
  points: number
  totalGoals: number
  alternatePoints: number
  registrationDate: Date
}

function computeGroupResults(groupMatches: MatchWithTeams[]) {
  const teamStats: Map<string, TeamStats> = new Map()

  const updateStats = (team: Team, goalsScored: number, opponentGoalsScored: number) => {
    let stats = teamStats.get(team.name) || {
      teamName: team.name,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0,
      totalGoals: 0,
      alternatePoints: 0,
      registrationDate: team.registrationDate
    }

    stats.totalGoals += goalsScored
    if (goalsScored > opponentGoalsScored) {
      stats.wins += 1
      stats.points += 3
      stats.alternatePoints += 5
    } else if (goalsScored == opponentGoalsScored) {
      stats.draws += 1
      stats.points += 1
      stats.alternatePoints += 3
    } else {
      stats.losses += 1
      stats.alternatePoints += 1
    }

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
