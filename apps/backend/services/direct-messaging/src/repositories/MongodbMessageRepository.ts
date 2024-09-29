import { Collection, Document, Db } from "mongodb";
import { Message } from "../models/Message";
import { MessageRepository } from "../interfaces/MessageRepository";

export class MongodbMessageRepository implements MessageRepository {
    private collection: Collection<Document>;

    // Inject the Db instance through the constructor
    constructor(db: Db) {
        this.collection = db.collection("messages");
    }

    // Insert a single message
    async insertMessage(message: Message): Promise<void> {
        const result = await this.collection.insertOne({ message });
        console.log(`Inserted message with id: ${result.insertedId}`);
    }
}
