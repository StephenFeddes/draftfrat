/**
 * This index file is used to export objects from the domain layer.
 */

// Exporting utilities
export { getEligibleFootballPositions } from "./entities/football/FootballPlayer";

// Exporting schemas
export { DraftSchema } from "./entities/Draft";
export { DraftPickSchema } from "./entities/DraftPick";
export { DraftUserSchema } from "./entities/DraftUser";
export { FootballPlayerSchema } from "./entities/football/FootballPlayer";
export { FootballTeamSchema } from "./entities/football/FootballTeam";
export { PlayerSchema } from "./entities/Player";
export { QueuedPlayerSchema } from "./entities/QueuedPlayer";
export { FootballDraftSettingsSchema } from "./value-objects/football/FootballDraftSettings";

// Exporting enums
export { DraftEventEnum } from "./enums/DraftEventEnum";
export { DraftOrderEnum } from "./enums/DraftOrderEnum";
export { FootballPositionEnum } from "./enums/FootballPositionEnum";
export { InjuryStatusEnum } from "./enums/InjuryStatusEnum";
export { ScoringEnum } from "./enums/ScoringEnum";
export { SportEnum } from "./enums/SportEnum";

// Exporting entities
export { Player } from "./entities/Player";
export { FootballPlayer } from "./entities/football/FootballPlayer";
export { QueuedPlayer } from "./entities/QueuedPlayer";
export { FootballTeam } from "./entities/football/FootballTeam";
export { DraftPick } from "./entities/DraftPick";
export { DraftUser } from "./entities/DraftUser";
export { Draft } from "./entities/Draft";

// Exporting value objects
export { DraftSettings } from "./value-objects/DraftSettings";
export { FootballDraftSettings } from "./value-objects/football/FootballDraftSettings";

// Exporting aggregates
export { Roster } from "./aggregates/roster/Roster";
export { RosterPool } from "./aggregates/roster-pool/RosterPool";
export { PlayerQueuePool } from "./aggregates/player-queue-pool/PlayerQueuePool";

// Exporting factories
export { RosterPoolFactory } from "./factories/RosterPoolFactory";
export { DraftPickOrderGeneratorFactory } from "./factories/DraftPickOrderGeneratorFactory";

// Exporting events
export { DraftEvent } from "./events/DraftEvent";
