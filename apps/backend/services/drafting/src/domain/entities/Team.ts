import { z } from "zod";
import { FootballTeamSchema } from "./football/FootballTeam";

export const TeamSchema = z.discriminatedUnion("sport", [FootballTeamSchema]);

export type Team = z.infer<typeof TeamSchema>;
