import { Request, Response } from "express";
import { FootballDraftSettings } from "../../../../domain/value-objects/football-draft-settings/FootballDraftSettings";
import { CreateDraft } from "../../../../contracts/use-cases/CreateDraft";

export class CreateFootballDraftHandler {
    private readonly createDraft: CreateDraft;

    constructor(createDraft: CreateDraft) {
        this.createDraft = createDraft;
    }

    public handle(req: Request, res: Response): void {
        try {
            this.createDraft.execute(
                req.body.creatorId,
                new FootballDraftSettings(
                    req.body.orderType,
                    req.body.sport,
                    req.body.scoringType,
                    req.body.teamCount,
                    req.body.pickTimeLimit,
                    req.body.isStarted,
                    new Date().toISOString(),
                    req.body.quarterbackSpotsCount,
                    req.body.runningBackSpotsCount,
                    req.body.wideReceiverSpotsCount,
                    req.body.tightEndSpotsCount,
                    req.body.flexSpotsCount,
                    req.body.benchSpotsCount,
                    req.body.kickerSpotsCount,
                    req.body.defenseSpotsCount,
                ),
            );
            res.status(201).send("Draft created.");
        } catch (error) {
            res.status(500).send(`Error creating draft. ${error}`);
        }
    }
}
