import { Message } from "../models/Message";

export interface MessageRepository {
    insertMessage(message: Message): Promise<void>;

    getLastMessagesToUser(userId: number): Promise<Message[]>;

    getMessagesBetweenUsers(userId1: number, userId2: number): Promise<Message[]>;
}