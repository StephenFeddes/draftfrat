import express from "express";
import { DraftRepositoryFactory } from "../../../infrastructure";
import { Draft, FootballDraftSettings, SportEnum } from "../../../domain";
import { CreateDraft, GetDrafts } from "../../../application";
import { databaseConnectionPool } from "../../../infrastructure/persistence/connection";

export const router = express.Router();

router.post("/drafts", (req, res) => {
    switch (req.body.sport) {
        case SportEnum.FOOTBALL:
            try {
                const settings: FootballDraftSettings = {
                    draftOrderType: req.body.orderType,
                    sport: req.body.sport,
                    scoringType: req.body.scoringType,
                    teamCount: req.body.teamCount,
                    pickTimeLimitSeconds: req.body.pickTimeLimit,
                    quarterbackSpotsCount: req.body.quarterbackSpotsCount,
                    runningBackSpotsCount: req.body.runningBackSpotsCount,
                    wideReceiverSpotsCount: req.body.wideReceiverSpotsCount,
                    tightEndSpotsCount: req.body.tightEndSpotsCount,
                    flexSpotsCount: req.body.flexSpotsCount,
                    benchSpotsCount: req.body.benchSpotsCount,
                    kickerSpotsCount: req.body.kickerSpotsCount,
                    defenseSpotsCount: req.body.defenseSpotsCount,
                };
                new CreateDraft(DraftRepositoryFactory.create(SportEnum.FOOTBALL, databaseConnectionPool)).execute(
                    req.body.creatorId,
                    settings,
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

router.get("/drafts", async (req, res) => {
    try {
        const drafts: Draft[] = await new GetDrafts(
            DraftRepositoryFactory.create(req.query.sport as SportEnum, databaseConnectionPool),
        ).execute(Number(req.query.userId));
        res.status(200).send(drafts);
    } catch {
        res.status(500);
    }
});
