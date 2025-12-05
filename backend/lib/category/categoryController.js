"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = getCategories;
var data_1 = __importDefault(require("./data"));
function getCategories(_req, res) {
    res.status(200).send(data_1.default);
}
