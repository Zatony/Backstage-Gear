export interface IMessage{
    messageId: number | null | undefined,
    content: string,
    sentAt: string,
    receiverId: number | null | undefined,
    senderId: number | null | undefined
};

export default class Message implements IMessage{
    messageId: number | null | undefined = null;
    content: string = "";
    sentAt: string = "";
    receiverId: number | null | undefined = null;
    senderId: number | null | undefined = null;

    constructor(message: IMessage){
        this.messageId = message.messageId;
        this.content = message.content;
        this.sentAt = message.sentAt;
        this.receiverId = message.receiverId;
        this.senderId = message.senderId;

        //Object.assign(this, message as Partial<Message>);
    };
};