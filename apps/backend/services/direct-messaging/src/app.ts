import { Server } from "socket.io";
import http from "http";
import * as dotenv from "dotenv";
dotenv.config();
/*
const dbUrl = process.env.DIRECT_MESSAGE_DB_URL;
if (!dbUrl) {
    throw new Error("DIRECT_MESSAGE_DB_URL is not defined in the environment variables");
}
mongoose.connect(dbUrl);
*/

const server = http.createServer((req, res) => {
    // Check if the request is for the root URL
    if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(`Hi ${process.env.DIRECT_MESSAGE_DB_URL}`);
    } else {
        // Handle other requests if needed
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});

const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"], // Allowed methods
        allowedHeaders: ["my-custom-header"], // Optional, adjust as needed
        credentials: false, // Disable credentials for security when using '*'
    },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("clientMessage", (data) => {
        console.log("Message from client:", data);
        socket.emit("serverResponse", `Server received: ${data}`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
    console.log(
        `Direct Messaging server is running.`
    );
});