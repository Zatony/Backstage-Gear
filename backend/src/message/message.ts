export interface IMessage{
    messageId: number | null | undefined,
    senderId: number | null | undefined,
    receiverId: number | null | undefined,
    content: string,
    sentAt: string
};

export class Message implements IMessage{
    messageId: number | null | undefined = null;
    senderId: number | null | undefined = null;
    receiverId: number | null | undefined = null;
    content: string = "";
    sentAt: string = "";

    constructor(message: IMessage){
        this.messageId = message.messageId;
        this.senderId = message.senderId;
        this.receiverId = message.receiverId;
        this.content = message.content;
        this.sentAt = message.sentAt;

        //Object.assign(this, message as Partial<Message>);
    };
};