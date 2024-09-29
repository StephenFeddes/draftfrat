import { MessageRepository } from "../interfaces/MessageRepository";
import { Message } from "../models/Message";

export class MessageService {
    private messageRepository: MessageRepository;
    // Inject the Db instance through the constructor
    constructor(messageRepository: MessageRepository) {
        this.messageRepository = messageRepository;
    }

    // Insert a single message
    async sendMessage(senderId: number, receiverId: number, content: string): Promise<void> {
        const currentTimeUtc = new Date();
        const message: Message = {
            _id: undefined,
            senderId: senderId,
            receiverId: receiverId,
            content: content,
            createdAt: currentTimeUtc,
        };
        await this.messageRepository.insertMessage(message);
    }
}
