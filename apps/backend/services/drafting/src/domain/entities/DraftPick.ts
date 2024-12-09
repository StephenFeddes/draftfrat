import { z } from "zod";
import { PlayerSchema } from "./Player";

export const DraftPickSchema = z.object({
    draftId: z.number().int().positive(),
    pickNumber: z.number().int().positive(),
    teamNumber: z.number().int().positive(),
    player: PlayerSchema.nullable(),
});

export type DraftPick = z.infer<typeof DraftPickSchema>;
