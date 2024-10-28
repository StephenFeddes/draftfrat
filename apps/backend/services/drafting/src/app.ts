import http from "http";
import express, { Application } from "express";
import * as dotenv from "dotenv";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { initializeDraftWebSocket } from "./presentation/websocket/DraftWebSocket";
import { db } from "./config/database";
import { draftRouter } from "./presentation/http/routes/draftRoutes";

dotenv.config();

const app: Application = express();
app.use(express.json());

app.get("/drafting", (req, res) => {
    res.send("Drafting service is running.");
});

app.use("/drafting/api/v1", draftRouter);

// Set up the server
const server = http.createServer(app);

initializeDraftWebSocket(server);

const PORT = process.env.PORT || 80;
server.listen(PORT, async () => {
    console.log(`Drafting server is running.`);
    try {
        console.log("Running migrations...");
        await migrate(db, { migrationsFolder: "./dist/migrations" });
        console.log("Migrations completed.");
    } catch (error) {
        console.error("Error running migrations:", error);
    }
});
