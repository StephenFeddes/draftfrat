import { MessageRepository } from "../interfaces/MessageRepository";
import { Message } from "../models/Message";

export class MessageService {
    private messageRepository: MessageRepository;
    // Inject the Db instance through the constructor
    constructor(messageRepository: MessageRepository) {
        this.messageRepository = messageRepository;
    }

    // Insert a single message
    async sendMessage(message: Message): Promise<void> {
        await this.messageRepository.insertMessage(message);
    }

    async getLastMessagesToUser(userId: number): Promise<Message[]> {
        return await this.messageRepository.getLastMessagesToUser(userId);
    }

    async getMessagesBetweenUsers(user1Id: number, user2Id: number) {
        return await this.messageRepository.getMessagesBetweenUsers(user1Id, user2Id);
    }
}
