import { Server } from "socket.io";
import http from "http";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { initializeDraftWebSocket } from "./websockets/DraftWebSocket";

const server = http.createServer((req, res) => {
    res.end(`Drafting service!`);
});

initializeDraftWebSocket(server);

// Start the server
const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
    console.log(`Direct Messaging server is running.`);
});
