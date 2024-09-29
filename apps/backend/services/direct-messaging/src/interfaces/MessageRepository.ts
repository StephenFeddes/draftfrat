import { Message } from "../models/Message";

export interface MessageRepository {
    insertMessage(message: Message): Promise<void>;
}