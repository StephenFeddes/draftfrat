import { Server, Socket } from "socket.io";
import { WebSocket } from "../../contracts/use-cases/WebSocket";

export class SocketIOWebSocket implements WebSocket {
    private socket: Socket;

    private io: Server;

    constructor(socket: Socket, io: Server) {
        this.socket = socket;
        this.io = io;
    }

    emit(event: string, ...data: any[]): void {
        this.socket.emit(event, ...data);
    }

    broadcastToRoom(room: string, event: string, ...data: any[]): void {
        this.io.emit("joinRoom", "draft:1");
    }

    on(event: string, callback: (...args: any[]) => void): void {
        this.socket.on(event, callback);
    }

    off(event: string, callback: (...args: any[]) => void): void {
        this.socket.off(event, callback);
    }

    async join(room: string): Promise<void> {
        await this.socket.join(room);
    }

    async leave(room: string): Promise<void> {
        await this.socket.leave(room);
    }

    disconnect(close?: boolean): void {
        this.socket.disconnect(close);
    }

    get id(): string {
        return this.socket.id;
    }

    get connected(): boolean {
        return this.socket.connected;
    }

    get rooms(): Set<string> {
        return this.socket.rooms;
    }
}
