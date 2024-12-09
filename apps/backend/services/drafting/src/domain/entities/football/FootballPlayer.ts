import { z } from "zod";
import { FootballPositionEnum } from "../../enums/FootballPositionEnum";
import { PlayerSchema } from "../Player";

export const FootballPlayerSchema = PlayerSchema.extend({
    pprRank: z.number().int().positive(),
    halfPprRank: z.number().int().positive(),
    standardRank: z.number().int().positive(),
    projectedRushingAttempts: z.number().nullable(),
    projectedRushingYards: z.number().nullable(),
    projectedRushingTouchdowns: z.number().nullable(),
    projectedTargets: z.number().nullable(),
    projectedReceivingYards: z.number().nullable(),
    projectedReceivingTouchdowns: z.number().nullable(),
    projectedPassingAttempts: z.number().nullable(),
    projectedPassingYards: z.number().nullable(),
    projectedPassingTouchdowns: z.number().nullable(),
    projectedStandardFantasyPoints: z.number().nullable(),
    projectedHalfPprFantasyPoints: z.number().nullable(),
    projectedPprFantasyPoints: z.number().nullable(),
});

export const getEligibleFootballPositions = (
    isQuarterback: boolean,
    isRunningBack: boolean,
    isWideReceiver: boolean,
    isTightEnd: boolean,
    isKicker: boolean,
    isDefense: boolean,
): FootballPositionEnum[] => {
    const positions = [];
    if (isQuarterback) {
        positions.push(FootballPositionEnum.QUARTERBACK);
    }
    if (isRunningBack) {
        positions.push(FootballPositionEnum.RUNNING_BACK);
    }
    if (isWideReceiver) {
        positions.push(FootballPositionEnum.WIDE_RECEIVER);
    }
    if (isTightEnd) {
        positions.push(FootballPositionEnum.TIGHT_END);
    }
    if (isKicker) {
        positions.push(FootballPositionEnum.KICKER);
    }
    if (isDefense) {
        positions.push(FootballPositionEnum.DEFENSE);
    }
    if (isRunningBack || isWideReceiver || isTightEnd) {
        positions.push(FootballPositionEnum.FLEX);
    }
    positions.push(FootballPositionEnum.BENCH);
    return positions;
};

export type FootballPlayer = z.infer<typeof FootballPlayerSchema>;
