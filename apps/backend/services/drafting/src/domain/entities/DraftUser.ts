import { z } from "zod";

export const DraftUserSchema = z.object({
    draftId: z.number().int().positive(),
    userId: z.number().int().positive(),
    teamName: z.string().nullable(),
    teamNumber: z.number().positive().nullable(),
    isAutoDrafting: z.boolean(),
    isAdmin: z.boolean(),
});

export type DraftUser = z.infer<typeof DraftUserSchema>;
