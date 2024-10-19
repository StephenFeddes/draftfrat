import { Server } from "socket.io";
import http from "http";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { initializeDirectMessagingWebSocket } from "./websockets/DirectMessageWebSocket";

dotenv.config();
const dbUrl = process.env.DIRECT_MESSAGING_MONGODB_URL;
if (!dbUrl) {
    throw new Error(
        "DIRECT_MESSAGING_MONGODB_URL is not defined in the environment variables"
    );
}
mongoose.connect(dbUrl);

const server = http.createServer((req, res) => {
    res.end(`Direct messaging service! ${dbUrl}`);
});

initializeDirectMessagingWebSocket(server);

// Start the server
const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
    console.log(`Direct Messaging server is running on port ${PORT}.`);
});
