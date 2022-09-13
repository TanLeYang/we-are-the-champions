import { Team } from "@prisma/client"
import { getAllMatchesWithTeams, MatchWithTeams } from "./match"
import { getAllTeams } from "./team"

const TOP_N_ADVANCES = 4

export async function computeResults() {
  const [allTeams, allMatches] = await Promise.all([getAllTeams(), getAllMatchesWithTeams()])
  return computeResultsFor(allTeams, allMatches)
}

async function computeResultsFor(allTeams: Team[], allMatches: MatchWithTeams[]) {
  const groupOneTeams = allTeams.filter((t) => t.group === 1)
  const groupTwoTeams = allTeams.filter((t) => t.group === 2)
  const groupOneMatches = allMatches.filter((m) => m.firstTeam.group === 1)
  const groupTwoMatches = allMatches.filter((m) => m.firstTeam.group === 2)

  const groupOneResults = computeGroupResults(groupOneTeams, groupOneMatches)
  const groupTwoResults = computeGroupResults(groupTwoTeams, groupTwoMatches)

  return {
    groupOne: groupOneResults,
    groupTwo: groupTwoResults
  }
}

function computeGroupResults(groupTeams: Team[], groupMatches: MatchWithTeams[]) {
  const teamStats = new Map(
    groupTeams.map((team) => {
      return [
        team.name,
        {
          teamName: team.name,
          wins: 0,
          draws: 0,
          losses: 0,
          points: 0,
          goalsScored: 0,
          alternatePoints: 0,
          registrationDate: team.registrationDate,
          didAdvance: false
        }
      ]
    })
  )

  const updateStats = (team: Team, goalsScored: number, opponentGoalsScored: number) => {
    let stats = teamStats.get(team.name)
    if (stats === undefined) {
      return
    }

    stats.goalsScored += goalsScored
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
    } else if (firstTeamStats.goalsScored !== secondTeamStats.goalsScored) {
      return firstTeamStats.goalsScored - secondTeamStats.goalsScored
    } else if (firstTeamStats.alternatePoints !== secondTeamStats.alternatePoints) {
      return firstTeamStats.alternatePoints - secondTeamStats.alternatePoints
    } else {
      return firstTeamStats.registrationDate > secondTeamStats.registrationDate ? -1 : 1
    }
  })
  allStats.reverse()
  for (let i = 0; i < TOP_N_ADVANCES; i++) {
    if (i >= allStats.length) {
      break
    }
    allStats[i].didAdvance = true
  }

  const results = allStats.map((stat) => ({
    ...stat,
    registrationDate: stat.registrationDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short"
    })
  }))

  return results
}
