import express from "express";
import { CreateDraftUseCase } from "../../../../application/commands/CreateDraftUseCase";
import { PostgresFootballDraftRepository } from "../../../../infrastructure/database/repositories/PostgresFootballDraftRepository";
import { CreateFootballDraftHandler } from "../handlers/CreateFootballDraftHandler";

const footballDraftRepository = new PostgresFootballDraftRepository();
export const draftRouter = express.Router();

draftRouter.post("/drafts", (req, res) =>
    new CreateFootballDraftHandler(new CreateDraftUseCase(footballDraftRepository)).handle(
        req,
        res,
    ),
);
