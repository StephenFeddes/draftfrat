import { MongoClient, Db } from "mongodb";

const uri = "mongodb://mongo:27017"; // Your MongoDB URI
const DATABASE_NAME = "direct_messaging"; // Your database name

let db: Db;

const client = new MongoClient(uri);

// Connect to the database and initialize the `db` variable
client
    .connect()
    .then(() => {
        db = client.db(DATABASE_NAME);
        console.log(`Connected to MongoDB database: ${DATABASE_NAME}`);
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
    });

// Export the db instance
export { db };
