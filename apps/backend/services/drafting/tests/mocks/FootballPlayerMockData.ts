import { FootballTeam, FootballPlayer, FootballPositionEnum } from "../../src/domain";

// Generate players
export const generateFootballPlayers = (): FootballPlayer[] => {
    // Define all NFL teams with full data
    const teams: FootballTeam[] = [
        new FootballTeam(1, "BUF", 13),
        new FootballTeam(2, "MIA", 10),
        new FootballTeam(3, "NE", 11),
        new FootballTeam(4, "NYJ", 7),
        new FootballTeam(5, "BAL", 13),
        new FootballTeam(6, "CIN", 7),
        new FootballTeam(7, "CLE", 5),
        new FootballTeam(8, "PIT", 6),
        new FootballTeam(9, "HOU", 7),
        new FootballTeam(10, "IND", 11),
        new FootballTeam(11, "JAX", 9),
        new FootballTeam(12, "TEN", 7),
        new FootballTeam(13, "DEN", 9),
        new FootballTeam(14, "KC", 10),
        new FootballTeam(15, "LV", 13),
        new FootballTeam(16, "LAC", 5),
        new FootballTeam(17, "CHI", 13),
        new FootballTeam(18, "DET", 9),
        new FootballTeam(19, "GB", 6),
        new FootballTeam(20, "MIN", 13),
        new FootballTeam(21, "ATL", 11),
        new FootballTeam(22, "CAR", 7),
        new FootballTeam(23, "NO", 11),
        new FootballTeam(24, "TB", 5),
        new FootballTeam(25, "ARI", 14),
        new FootballTeam(26, "LAR", 10),
        new FootballTeam(27, "SF", 9),
        new FootballTeam(28, "SEA", 5),
        new FootballTeam(29, "DAL", 7),
        new FootballTeam(30, "NYG", 13),
        new FootballTeam(31, "PHI", 10),
        new FootballTeam(32, "WAS", 14),
    ];
    const players: FootballPlayer[] = [];
    let id = 1;

    // Helper to add players
    const addPlayer = (
        firstName: string,
        lastName: string,
        team: FootballTeam,
        positionFlags: Partial<Record<FootballPositionEnum, boolean>>,
        pprRank: number,
        halfPprRank: number,
        standardRank: number,
    ) => {
        players.push(
            new FootballPlayer(
                id++,
                firstName,
                lastName,
                null, // averageDraftPosition
                null, // injuryStatus
                0, // yearsExperience
                null, // headshotUrl
                team,
                pprRank,
                halfPprRank,
                standardRank,
                !!positionFlags[FootballPositionEnum.QUARTERBACK],
                !!positionFlags[FootballPositionEnum.RUNNING_BACK],
                !!positionFlags[FootballPositionEnum.WIDE_RECEIVER],
                !!positionFlags[FootballPositionEnum.TIGHT_END],
                !!positionFlags[FootballPositionEnum.KICKER],
                !!positionFlags[FootballPositionEnum.DEFENSE],
                null, // projectedRushingAttempts
                null, // projectedRushingYards
                null, // projectedRushingTouchdowns
                null, // projectedTargets
                null, // projectedReceivingYards
                null, // projectedReceivingTouchdowns
                null, // projectedPassingAttempts
                null, // projectedPassingYards
                null, // projectedPassingTouchdowns
                null, // projectedStandardFantasyPoints
                null, // projectedHalfPprFantasyPoints
                null, // projectedPprFantasyPoints
            ),
        );
    };

    // Generate players for each team
    teams.forEach((team, index) => {
        // Quarterback
        addPlayer(
            `${team.abbreviation}`,
            `QB`,
            team,
            { [FootballPositionEnum.QUARTERBACK]: true },
            index + 1,
            index + 1,
            index + 1,
        );

        // Running backs (2 per team)
        addPlayer(
            `${team.abbreviation}`,
            `RB1`,
            team,
            { [FootballPositionEnum.RUNNING_BACK]: true },
            index + 33,
            index + 33,
            index + 33,
        );
        addPlayer(
            `${team.abbreviation}`,
            `RB2`,
            team,
            { [FootballPositionEnum.RUNNING_BACK]: true },
            index + 65,
            index + 65,
            index + 65,
        );

        // Wide receivers (2 per team)
        addPlayer(
            `${team.abbreviation}`,
            `WR1`,
            team,
            { [FootballPositionEnum.WIDE_RECEIVER]: true },
            index + 97,
            index + 97,
            index + 97,
        );
        addPlayer(
            `${team.abbreviation}`,
            `WR2`,
            team,
            { [FootballPositionEnum.WIDE_RECEIVER]: true },
            index + 129,
            index + 129,
            index + 129,
        );

        // Tight end
        addPlayer(
            `${team.abbreviation}`,
            `TE`,
            team,
            { [FootballPositionEnum.TIGHT_END]: true },
            index + 161,
            index + 161,
            index + 161,
        );

        // Kicker
        addPlayer(
            `${team.abbreviation}`,
            `K`,
            team,
            { [FootballPositionEnum.KICKER]: true },
            index + 193,
            index + 193,
            index + 193,
        );

        // Defense
        addPlayer(
            `${team.abbreviation}`,
            `${team.abbreviation}`,
            team,
            { [FootballPositionEnum.DEFENSE]: true },
            index + 225,
            index + 225,
            index + 225,
        );
    });

    return players;
};
