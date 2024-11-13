import { DraftSettingsDTO } from "./DraftSettingsDTO";

export type FootballDraftSettingsDTO = DraftSettingsDTO & {
    quarterbackSpotsCount: number;
    runningBackSpotsCount: number;
    wideReceiverSpotsCount: number;
    tightEndSpotsCount: number;
    flexSpotsCount: number;
    benchSpotsCount: number;
    kickerSpotsCount: number;
    defenseSpotsCount: number;
};
