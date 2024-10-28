import express from "express";
import { DraftController } from "../../../api/endpoints/draftController";

export const draftRouter = express.Router();
const draftController = new DraftController();

draftRouter.post("/football-drafts", draftController.createFootballDraft);
