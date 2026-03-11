import { bodyIsUndefined, idIsNan } from "../validators/id.validator";
import { Message, IMessage } from "./message";
import { getUserIncomingMessagesService, getUserIncomingMessageByIdService, getUserSentMessagesService, getUserSentMessageByIdService, postNewMessageService, deleteMessageByIdService, patchMessageByIdService } from "./messageService";


export async function getUserIncomingMessages(req: any, res: any){
    const userId: number = parseInt(req.user.id);
    idIsNan(userId, res);

    if (isNaN(userId)) {
        return;
    }

    try {
        const results = await getUserIncomingMessagesService(userId);
        res.status(200).send(results);
    }
    catch (err: any) {
        if (err.message === "USER_NOT_FOUND") {
            return res.status(404).send("Ez a felhasználó nem létezik.");
        }

        if (err.message === "NO_INCOMING_MESSAGES") {
            return res.status(404).send("Nincsenek beérkező üzenetek.");
        }

        console.log(err);
        res.status(500).send("Szerver hiba.");
    }
};


export async function getUserIcomingMessageById(req: any, res: any){
    const userId: number = parseInt(req.user.id);
    const messageId: number = parseInt(req.params.messageId);

    idIsNan(userId, res);
    idIsNan(messageId, res);

    if (isNaN(userId) || isNaN(messageId)) {
        return;
    }

    try {
        const result = await getUserIncomingMessageByIdService(userId, messageId);
        res.status(200).send(result);
    }
    catch (err: any) {
        if (err.message === "USER_NOT_FOUND") {
            return res.status(404).send("Ez a felhasználó nem létezik.");
        }

        if (err.message === "MESSAGE_NOT_FOUND") {
            return res.status(404).send("Nem létezik ilyen azonosítójú elem.");
        }

        console.log(err);
        res.status(500).send("Szerver hiba.");
    }
};


export async function getUserSentMessages(req: any, res: any){
    const userId: number = parseInt(req.user.id);
    idIsNan(userId, res);

    if (isNaN(userId)) {
        return;
    }

    try {
        const results = await getUserSentMessagesService(userId);
        res.status(200).send(results);
    }
    catch (err: any) {
        if (err.message === "USER_NOT_FOUND") {
            return res.status(404).send("Ez a felhasználó nem létezik.");
        }

        if (err.message === "NO_SENT_MESSAGES") {
            return res.status(404).send("Nincsenek elküldött üzenetek.");
        }

        console.log(err);
        res.status(500).send("Szerver hiba.");
    }
};


export async function getUserSentMessageById(req: any, res: any){
    const userId: number = parseInt(req.user.id);
    const messageId: number = parseInt(req.params.messageId);

    idIsNan(userId, res);
    idIsNan(messageId, res);

    if (isNaN(userId) || isNaN(messageId)) {
        return;
    }

    try {
        const result = await getUserSentMessageByIdService(userId, messageId);
        res.status(200).send(result);
    }
    catch (err: any) {
        if (err.message === "USER_NOT_FOUND") {
            return res.status(404).send("Ez a felhasználó nem létezik.");
        }

        if (err.message === "MESSAGE_NOT_FOUND") {
            return res.status(404).send("Nem létezik ilyen azonosítójú elem.");
        }

        console.log(err);
        res.status(500).send("Szerver hiba.");
    }
};


export async function postNewMessage(req: any, res: any) {
    const sendId: number = parseInt(req.user.id);
    const recId: number = parseInt(req.params.recId);

    idIsNan(recId, res);
    bodyIsUndefined(req, res);

    if (isNaN(recId) || !req.body) {
        return;
    }

    let newMessage: any = new Message(req.body as IMessage);

    if(newMessage.content == "" || !newMessage.content){
        res.status(400).send("Hibásan vagy nem megfelelően megadott adatok.");
        return;
    };

    try {
        await postNewMessageService(sendId, recId, newMessage.content);
        res.status(201).send("Sikeres üzenetküldés.");
    }
    catch (err: any) {
        if (err.message === "USER_NOT_FOUND") {
            return res.status(404).send("Ez a felhasználó nem létezik.");
        }

        if (err.message === "INVALID_MESSAGE_CONTENT") {
            return res.status(400).send("Hibásan vagy nem megfelelően megadott adatok.");
        }

        if (err.message === "MESSAGE_SEND_FAILED") {
            return res.status(404).send("Nem sikerült elküldeni az üzenetet.");
        }

        console.log(err);
        res.status(500).send("Szerver hiba.");
    }
};


export async function deleteMessageById(req: any, res: any) {
    const messId: number = parseInt(req.params.messId);
    const userId = req.user.id;

    idIsNan(messId, res);

    if (isNaN(messId)) {
        return;
    }

    try {
        await deleteMessageByIdService(messId, userId);
        res.status(204).send();
    }
    catch (err: any) {
        if (err.message === "MESSAGE_NOT_FOUND") {
            return res.status(404).send("Nem létezik ilyen azonosítójú üzenet.");
        }

        if (err.message === "MESSAGE_FORBIDDEN") {
            return res.status(403).send("Nincs jogosultságod törölni ezt az üzenetet.");
        }

        console.log(err);
        res.status(500).send("Szerver hiba.");
    }
};


export async function patchMessageById(req: any, res: any) {
    const messId = parseInt(req.params.messId);
    const userId = req.user.id;

    idIsNan(messId, res);
    bodyIsUndefined(req, res);

    if (isNaN(messId) || !req.body) {
        return;
    }

    if (typeof req.body.content !== "string" || req.body.content.trim() === "") {
        res.status(400).send("Hiányosan megadott adatok.");
        return;
    }

    try {
        await patchMessageByIdService(messId, userId, req.body.content);
        res.status(204).send();
    }
    catch (err: any) {
        if (err.message === "INVALID_MESSAGE_CONTENT") {
            return res.status(400).send("Hiányosan megadott adatok.");
        }

        if (err.message === "MESSAGE_NOT_FOUND") {
            return res.status(404).send("Nem létezik ilyen üzenet.");
        }

        if (err.message === "MESSAGE_FORBIDDEN") {
            return res.status(403).send("Nincs jogosultságod módosítani ezt az üzenetet.");
        }

        console.error(err);
        res.status(500).send("Szerver hiba.");
    }
};