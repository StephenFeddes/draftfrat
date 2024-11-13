import { DraftOrderEnum } from "../enums/DraftOrderEnum";
import { ScoringEnum } from "../enums/ScoringEnum";
import { SportEnum } from "../enums/SportEnum";

export type DraftSettingsDTO = {
    orderType: DraftOrderEnum;
    sport: SportEnum;
    scoringType: ScoringEnum;
    pickTimeLimit: number;
    teamCount: number;
    createdAt: string;
    isStarted: boolean;
};
