import { z } from "zod";
import { PlayerSchema } from "./Player";

export const QueuedPlayerSchema = z.object({
    draftId: z.number().positive(),
    userId: z.number().positive(),
    priority: z.number().positive(),
    player: PlayerSchema,
});

export type QueuedPlayer = z.infer<typeof QueuedPlayerSchema>;
