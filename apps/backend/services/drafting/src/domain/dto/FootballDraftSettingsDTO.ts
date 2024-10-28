import { DraftSettingsDTO } from "./DraftSettingsDTO";

export type FootballDraftSettingsDTO = DraftSettingsDTO & {
    quarterback_spots_count: number;
    running_back_spots_count: number;
    wide_receiver_spots_count: number;
    tight_end_spots_count: number;
    flex_spots_count: number;
    bench_spots_count: number;
    kicker_spots_count: number;
    defense_spots_count: number;
};
