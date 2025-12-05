"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
var Message = /** @class */ (function () {
    function Message(message) {
        this.messageId = null;
        this.content = "";
        this.sentAt = "";
        this.receiverId = null;
        this.senderId = null;
        this.messageId = message.messageId;
        this.content = message.content;
        this.sentAt = message.sentAt;
        this.receiverId = message.receiverId;
        this.senderId = message.senderId;
        //Object.assign(this, message as Partial<Message>);
    }
    ;
    return Message;
}());
exports.default = Message;
;
