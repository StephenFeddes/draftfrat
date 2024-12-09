import { z } from "zod";
import { DraftSettingsSchema } from "../value-objects/DraftSettings";

export const DraftSchema = z.object({
    id: z.number().positive(),
    settings: DraftSettingsSchema,
    isStarted: z.boolean(),
    isComplete: z.boolean(),
    createdAt: z
        .string()
        .refine((val) => !Number.isNaN(Date.parse(val)), { message: "createdAt must be a valid date string" })
        .nullable(),
});

export type Draft = z.infer<typeof DraftSchema>;
