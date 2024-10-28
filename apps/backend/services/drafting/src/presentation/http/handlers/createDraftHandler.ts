import { Request, Response } from "express";
import { DraftingService } from "../../services/DraftingService";

export class createDraftHandler {
    public createFootballDraft = (req: Request, res: Response): void => {
        try {
            new DraftingService("football").createDrafts(req.body.creatorId, req.body.settings);
            res.status(201).send("Draft created.");
        } catch (error) {
            res.status(500).send(`Error creating draft. ${error}`);
        }
    };
}
