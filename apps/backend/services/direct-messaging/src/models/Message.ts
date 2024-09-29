export type Message = {
    _id: string | undefined;
    senderId: number;
    receiverId: number;
    content: string;
    createdAt: Date;
};