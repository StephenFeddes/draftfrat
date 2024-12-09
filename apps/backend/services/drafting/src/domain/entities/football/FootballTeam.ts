import { z } from "zod";
import { SportEnum } from "../../enums/SportEnum";

export const FootballTeamSchema = z.object({
    id: z.number().int().positive(),
    abbreviation: z.string(),
    sport: z.nativeEnum(SportEnum),
    byeWeek: z.number().int().positive(),
});

export type FootballTeam = z.infer<typeof FootballTeamSchema>;
