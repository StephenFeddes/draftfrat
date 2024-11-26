import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";

describe("StartDraft", () => {
    let postgresContainer: StartedPostgreSqlContainer;

    beforeAll(async () => {
        jest.setTimeout(30000); // Extend Jest's timeout for the suite
        postgresContainer = await new PostgreSqlContainer().start();
        console.log("Postgres container started:", {
            host: postgresContainer.getHost(),
            port: postgresContainer.getPort(),
        });
    }, 30000); // Explicit timeout for the beforeAll hook

    afterAll(async () => {
        if (postgresContainer) {
            await postgresContainer.stop();
            console.log("Postgres container stopped");
        }
    });

    it("works with postgres", async () => {
        expect(postgresContainer.getHost()).toBeDefined();
        expect(postgresContainer.getPort()).toBeDefined();
        console.log("Host:", postgresContainer.getHost());
        console.log("Port:", postgresContainer.getPort());
    });
});
