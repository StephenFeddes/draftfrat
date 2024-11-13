import { FootballTeamDTO } from "./FootballTeamDTO";
import { PlayerDTO } from "./PlayerDTO";

export type FootballPlayerDTO = PlayerDTO & {
    id: number;
    team: FootballTeamDTO | null;
    pprRank: number;
    halfPprRank: number;
    standardRank: number;
    isQuarterback: boolean;
    isRunningBack: boolean;
    isWideReceiver: boolean;
    isTightEnd: boolean;
    isKicker: boolean;
    isDefense: boolean;
    projectedRushingAttempts: number | null;
    projectedRushingYards: number | null;
    projectedRushingTouchdowns: number | null;
    projectedTargets: number | null;
    projectedReceivingYards: number | null;
    projectedReceivingTouchdowns: number | null;
    projectedPassingAttempts: number | null;
    projectedPassingYards: number | null;
    projectedPassingTouchdowns: number | null;
    projectedStandardFantasyPoints: number | null;
    projectedHalfPprFantasyPoints: number | null;
    projectedPprFantasyPoints: number | null;
};
