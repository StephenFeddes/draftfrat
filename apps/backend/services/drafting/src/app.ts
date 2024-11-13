import http from "http";
import express, { Application } from "express";
import * as dotenv from "dotenv";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./infrastructure/database/connection";
import { draftRouter } from "./presentation/http/v1/routes/draftRoutes";
import { seedDatabase } from "./infrastructure/database/seeds/seed";
import { DraftWebSocketService } from "./presentation/websocket/DraftWebSocketService";

dotenv.config();

const app: Application = express();
app.use(express.json());

app.get("/drafting", (req, res) => {
    res.send("Drafting service is running.");
});

app.use("/drafting/api/v1", draftRouter);

// Set up the server
const server = http.createServer(app);

const PORT = process.env.PORT || 80;
server.listen(PORT, async () => {
    console.log(`Drafting server is running.`);
    try {
        console.log("Running migrations...");
        await migrate(db, { migrationsFolder: "./dist/infrastructure/database/migrations" });
        await seedDatabase();
        console.log("Migrations completed.");
        await DraftWebSocketService.initialize(server);
    } catch (error) {
        console.error("Error running migrations:", error);
    }
});
