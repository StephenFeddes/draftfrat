import http from "http";
import express, { Application } from "express";
import * as dotenv from "dotenv";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { databaseConnectionPool, db } from "./infrastructure/persistence/connection";
import { router } from "./presentation/http/v1/router";
import { seedDatabase } from "./infrastructure/persistence/seeds/seed";
import { InitializeDraftWebSocketManager } from "./presentation/websocket/InitializeDraftWebSocketManager";

dotenv.config();

const app: Application = express();
app.use(express.json());

app.get("/drafting", (req, res) => {
    res.send("Drafting service is running.");
});

app.use("/drafting/api/v1", router);

// Set up the server
const server = http.createServer(app);

const PORT = process.env.PORT || 80;
server.listen(PORT, async () => {
    console.log(`Drafting server is running.`);
    try {
        console.log("Running migrations...");
        await migrate(db, { migrationsFolder: "./dist/infrastructure/persistence/migrations" });
        await seedDatabase();
        console.log("Migrations completed.");
        await InitializeDraftWebSocketManager.execute(server, databaseConnectionPool);
    } catch (error) {
        console.error("Error running migrations:", error);
    }
});
