import { FootballTeamDTO } from "./FootballTeamDTO";
import { PlayerDTO } from "./PlayerDTO";

export type FootballPlayerDTO = PlayerDTO & {
    team: FootballTeamDTO;
    pprRank: number;
    halfPprRank: number;
    standardRank: number;
    isQuarterback: boolean;
    isRunningBack: boolean;
    isWideReceiver: boolean;
    isTightEnd: boolean;
    isKicker: boolean;
    isDefense: boolean;
};
