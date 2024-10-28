import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/schema",
    out: "./src/migrations",

    dbCredentials: {
        url:
            process.env.POSTGRES_DATABASE_URL ||
            "postgres://username1:password1@postgresdb:5432/drafting_service",
    },
});
