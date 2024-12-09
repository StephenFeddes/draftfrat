import { Namespace, Socket } from "socket.io";
import { WebSocket } from "../../interfaces";

export class SocketIOWebSocket implements WebSocket {
    private socket: Socket;

    private io: Namespace;

    constructor(socket: Socket, io: Namespace) {
        this.socket = socket;
        this.io = io;
    }

    public emit(event: string, ...data: any[]): void {
        this.socket.emit(event, ...data);
    }

    public broadcastToRoom(room: string, event: string, data: any): void {
        this.io.to(room).emit(event, data);
    }

    public on(event: string, callback: (...args: any[]) => void): void {
        this.socket.on(event, callback);
    }

    public off(event: string, callback: (...args: any[]) => void): void {
        this.socket.off(event, callback);
    }

    public async join(room: string): Promise<void> {
        await this.socket.join(room);
    }

    public async leave(room: string): Promise<void> {
        await this.socket.leave(room);
    }

    public disconnect(close?: boolean): void {
        this.socket.disconnect(close);
    }

    public getId(): string {
        return this.socket.id;
    }

    public isConnected(): boolean {
        return this.socket.connected;
    }

    public getRooms(): string[] {
        return Object.keys(this.socket.rooms);
    }
}
