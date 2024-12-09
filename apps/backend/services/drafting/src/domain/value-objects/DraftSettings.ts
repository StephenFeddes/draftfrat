import { z } from "zod";
import { DraftOrderEnum } from "../enums/DraftOrderEnum";
import { SportEnum } from "../enums/SportEnum";
import { ScoringEnum } from "../enums/ScoringEnum";

export const DraftSettingsSchema = z.object({
    draftOrderType: z.nativeEnum(DraftOrderEnum),
    sport: z.nativeEnum(SportEnum),
    scoringType: z.nativeEnum(ScoringEnum),
    teamCount: z.number().int().positive(),
    pickTimeLimitSeconds: z.number().int().positive().nullable(),
});

export type DraftSettings = z.infer<typeof DraftSettingsSchema>;
