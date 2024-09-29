export class DirectMessagesWebSocketClient {

    private url: string;

    private socket: WebSocket | null;

    constructor(userId: number) {
        this.url = `ws://localhost:3000/ws`;
        this.socket = null;
    }

    // Initialize and open WebSocket connection
    connect() {
        this.socket = new WebSocket(this.url);

        // Event listeners for the WebSocket connection
        this.socket.onopen = () => {
            console.log("Connected to WebSocket server:", this.url);
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.onMessageReceived(data);
        };

        this.socket.onclose = (event) => {
            console.log("WebSocket connection closed:", event);
        };

        this.socket.onerror = (error) => {
            console.log("WebSocket error:", error);
        };
    }

    // Method to send a message
    sendMessage(senderID: number, message: string) {
        const msg = JSON.stringify({
            senderID: senderID,
            message: message,
        });
        this.socket?.send(msg);
    }

    // Callback when a message is received
    onMessageReceived(data: any) {
        console.log("Message received from server:", data);
        // Implement further message handling logic (update UI, etc.)
    }

    // Method to close the connection
    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }
}
