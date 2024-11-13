export interface WebSocket {
    /**
     * Sends a message to the client or a specific room.
     * @param event - The event name.
     * @param data - The data to send with the event.
     */
    emit(event: string, ...data: any[]): void;

    /**
     * Broadcasts a message to all clients in a specific room.
     * @param room - The room to broadcast to.
     * @param event - The event name.
     * @param data - The data to send with the event.
     */
    broadcastToRoom(room: string, event: string, ...data: any[]): void;

    /**
     * Listens for a specific event from the client.
     * @param event - The event name to listen for.
     * @param callback - The callback function to execute when the event is received.
     */
    on(event: string, callback: (...args: any[]) => void): void;

    /**
     * Removes a specific listener for an event.
     * @param event - The event name.
     * @param callback - The original callback function to remove.
     */
    off(event: string, callback: (...args: any[]) => void): void;

    /**
     * Joins a room.
     * @param room - The room to join.
     */
    join(room: string): Promise<void>;

    /**
     * Leaves a room.
     * @param room - The room to leave.
     */
    leave(room: string): Promise<void>;

    /**
     * Disconnects the socket.
     * @param close - Whether to close the connection immediately.
     */
    disconnect(close?: boolean): void;

    /**
     * Returns the ID of the connected client.
     */
    id: string;

    /**
     * Checks if the socket is currently connected.
     */
    connected: boolean;

    /**
     * Gets the rooms the socket is currently joined in.
     */
    rooms: Set<string>;
}
