/**
 * Broadcasts and listens for events on a websocket connection.
 */
export interface WebSocket {
    /**
     * Emits an event to the websocket connection.
     *
     * @param event The event to emit.
     * @param data The data to send with the event.
     */
    emit(event: string, ...data: any[]): void;

    /**
     * Broadcasts an event to all clients in a room.
     *
     * @param room The room to broadcast the event to.
     * @param event The event to broadcast.
     * @param data The data to send with the event.
     */
    broadcastToRoom(room: string, event: string, data: any): void;

    /**
     * Listens for an event on the websocket connection.
     *
     * @param event The event to listen for.
     * @param callback The callback to call when the event is received.
     */
    on(event: string, callback: (...args: any[]) => void): void;

    /**
     * Stops listening for an event on the websocket connection.
     *
     * @param event The event to stop listening for.
     * @param callback The callback that was previously registered to listen for the event.
     */
    off(event: string, callback: (...args: any[]) => void): void;

    /**
     * Joins a room on the websocket connection.
     *
     * @param room The room to join.
     */
    join(room: string): Promise<void>;

    /**
     * Leaves a room on the websocket connection.
     *
     * @param room The room to leave.
     */
    leave(room: string): Promise<void>;

    /**
     * Disconnects the websocket connection.
     *
     * @param close Whether to close the connection.
     */
    disconnect(close?: boolean): void;

    /**
     * Gets the ID of the websocket connection.
     *
     * @returns The ID of the websocket connection.
     */
    getId(): string;

    /**
     * Checks if the websocket connection is connected.
     *
     * @returns Whether the websocket connection is connected.
     */
    isConnected(): boolean;

    /**
     * Gets the rooms that the websocket connection is in.
     *
     * @returns The rooms that the websocket connection is in.
     */
    getRooms(): string[];
}
