"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileDatasById = getProfileDatasById;
var data_1 = __importDefault(require("./data"));
function getProfileDatasById(req, res) {
    var userName = req.params.userName;
    var userResult = data_1.default.some(function (u) { return u.userName === userName; });
    if (!userResult) {
        res.status(404).send("Ez a felhasználó még nem létezik.");
        return;
    }
    ;
    var result = data_1.default.find(function (p) { return p.userName === userName; });
    if (result) {
        res.status(200).send(result);
        return;
    }
    ;
    res.status(404).send("Nem található ilyen elem.");
}
;
