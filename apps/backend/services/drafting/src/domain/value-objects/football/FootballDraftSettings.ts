import { z } from "zod";
import { DraftSettingsSchema } from "../DraftSettings";
import { SportEnum } from "../../enums/SportEnum";

export const FootballDraftSettingsSchema = DraftSettingsSchema.extend({
    sport: z.literal(SportEnum.FOOTBALL),
    quarterbackSpotsCount: z.number().int().positive(),
    runningBackSpotsCount: z.number().int().positive(),
    wideReceiverSpotsCount: z.number().int().positive(),
    tightEndSpotsCount: z.number().int().positive(),
    flexSpotsCount: z.number().int().positive(),
    benchSpotsCount: z.number().int().positive(),
    kickerSpotsCount: z.number().int().positive(),
    defenseSpotsCount: z.number().int().positive(),
});

export type FootballDraftSettings = z.infer<typeof FootballDraftSettingsSchema>;
