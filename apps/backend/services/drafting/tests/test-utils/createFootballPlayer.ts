import { FootballPlayer, FootballPositionEnum } from "../../src/domain";

export const createFootballPlayer = (id: number, positions: FootballPositionEnum[]): FootballPlayer => {
    const eligiblePositions: FootballPositionEnum[] = positions;
    eligiblePositions.push(FootballPositionEnum.BENCH);
    if (
        eligiblePositions.includes(FootballPositionEnum.RUNNING_BACK) ||
        eligiblePositions.includes(FootballPositionEnum.WIDE_RECEIVER) ||
        eligiblePositions.includes(FootballPositionEnum.TIGHT_END)
    ) {
        eligiblePositions.push(FootballPositionEnum.FLEX);
    }
    return {
        id: id,
        firstName: "",
        lastName: "",
        averageDraftPosition: null,
        injuryStatus: null,
        yearsExperience: 0,
        headshotUrl: "headshotUrl",
        positions: eligiblePositions,
        team: null,
        pprRank: 1,
        halfPprRank: 1,
        standardRank: 1,
        projectedRushingAttempts: null,
        projectedRushingYards: null,
        projectedRushingTouchdowns: null,
        projectedTargets: null,
        projectedReceivingYards: null,
        projectedReceivingTouchdowns: null,
        projectedPassingAttempts: null,
        projectedPassingYards: null,
        projectedPassingTouchdowns: null,
        projectedStandardFantasyPoints: null,
        projectedHalfPprFantasyPoints: null,
        projectedPprFantasyPoints: null,
    };
};
