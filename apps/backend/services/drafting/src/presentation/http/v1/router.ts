import express from "express";
import { CreateDraftUseCase } from "../../../application";
import { DraftRepositoryFactory } from "../../../infrastructure/database/factories/DraftRepositoryFactory";
import { FootballDraftSettings, SportEnum } from "../../../domain";

export const router = express.Router();

router.post("/drafts", (req, res) => {
    switch (req.body.sport) {
        case SportEnum.FOOTBALL:
            try {
                new CreateDraftUseCase(DraftRepositoryFactory.create(SportEnum.FOOTBALL)).execute(
                    req.body.creatorId,
                    new FootballDraftSettings(
                        req.body.orderType,
                        req.body.sport,
                        req.body.scoringType,
                        req.body.teamCount,
                        req.body.pickTimeLimit,
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
                res.status(201).send("Draft created");
            } catch (error) {
                res.status(500).send(error);
            }
            break;
        default:
            res.status(400).send("Invalid sport");
    }
});
