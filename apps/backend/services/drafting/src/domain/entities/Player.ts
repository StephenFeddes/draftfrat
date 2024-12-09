import { z } from "zod";
import { InjuryStatusEnum } from "../enums/InjuryStatusEnum";
import { TeamSchema } from "./Team";

export const PlayerSchema = z.object({
    id: z.number().int(),
    firstName: z.string(),
    lastName: z.string(),
    averageDraftPosition: z.number().nullable(),
    injuryStatus: z.nativeEnum(InjuryStatusEnum).nullable(),
    yearsExperience: z.number().int().nonnegative(),
    headshotUrl: z.string().url().nullable(),
    positions: z.array(z.string()),
    team: TeamSchema.nullable(),
});

export type Player = z.infer<typeof PlayerSchema>;
