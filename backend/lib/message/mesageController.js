"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIncomingMessages = getUserIncomingMessages;
exports.getUserIcomingMessageById = getUserIcomingMessageById;
exports.getUserSentMessages = getUserSentMessages;
exports.getUserSentMessageById = getUserSentMessageById;
var data_1 = __importDefault(require("./data"));
function idIsNan(id, res) {
    if (isNaN(id)) {
        res.status(400).send("Nem megfelelő formátumú azonosító.");
        return;
    }
    ;
}
;
function getUserIncomingMessages(req, res) {
    var userName = req.params.userName;
    var userResult = data_1.default.some(function (u) { return u.receiver === userName; });
    if (!userResult) {
        res.status(404).send("Ez a felhasználó még nem kapott üzeneteket vagy nem létezik.");
        return;
    }
    ;
    var results = data_1.default.filter(function (m) { return m.receiver === userName; });
    if (results.length > 0) {
        res.status(200).send(results);
        return;
    }
    ;
    res.status(400).send("Nincsenek beérkező üzenetek.");
}
;
function getUserIcomingMessageById(req, res) {
    var userName = req.params.userName;
    var messageId = parseInt(req.params.messageId);
    idIsNan(messageId, res);
    var userResult = data_1.default.some(function (u) { return u.receiver === userName; });
    if (!userResult) {
        res.status(404).send("Ez a felhasználó még nem kapott üzeneteket vagy nem létezik.");
        return;
    }
    ;
    var results = data_1.default.filter(function (m) { return m.receiver === userName && m.messageId === messageId; });
    if (results.length > 0) {
        res.status(200).send(results);
        return;
    }
    ;
    res.status(400).send("Nem létezik ilyen azonosítójú elem.");
}
;
function getUserSentMessages(req, res) {
    var userName = req.params.userName;
    var userResult = data_1.default.some(function (u) { return u.sender === userName; });
    if (!userResult) {
        res.status(404).send("Ez a felhasználó még nem küldött üzeneteket vagy nem létezik.");
        return;
    }
    ;
    var results = data_1.default.filter(function (m) { return m.sender === userName; });
    if (results.length > 0) {
        res.status(200).send(results);
        return;
    }
    ;
    res.status(400).send("Nincsenek elküldött üzenetek.");
}
;
function getUserSentMessageById(req, res) {
    var userName = req.params.userName;
    var messageId = parseInt(req.params.messageId);
    idIsNan(messageId, res);
    var userResult = data_1.default.some(function (u) { return u.sender === userName; });
    if (!userResult) {
        res.status(404).send("Ez a felhasználó még nem küldött üzeneteket vagy nem létezik.");
        return;
    }
    ;
    var results = data_1.default.filter(function (m) { return m.sender === userName && m.messageId === messageId; });
    if (results.length > 0) {
        res.status(200).send(results);
        return;
    }
    ;
    res.status(400).send("Nem létezik ilyen azonosítójú elem.");
}
;
