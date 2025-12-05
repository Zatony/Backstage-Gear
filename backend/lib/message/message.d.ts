export interface IMessage {
    messageId: number | null | undefined;
    content: string;
    sentAt: string;
    receiverId: number | null | undefined;
    senderId: number | null | undefined;
}
export default class Message implements IMessage {
    messageId: number | null | undefined;
    content: string;
    sentAt: string;
    receiverId: number | null | undefined;
    senderId: number | null | undefined;
    constructor(message: IMessage);
}
