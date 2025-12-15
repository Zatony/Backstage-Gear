"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAds = getAds;
exports.getAdDatasById = getAdDatasById;
exports.getUserAds = getUserAds;
exports.getUserAdById = getUserAdById;
var data_1 = __importDefault(require("./data"));
var promise_1 = __importDefault(require("mysql2/promise"));
var config_1 = __importDefault(require("../config/config"));
function idIsNan(id, res) {
    if (isNaN(id)) {
        res.status(400).send("Nem megfelelő formátumú azonosító.");
        return;
    }
    ;
}
;
function getAds(_req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, _a, results, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, promise_1.default.createConnection(config_1.default.database)];
                case 1:
                    connection = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, connection.query("SELECT \n                advertisements.id,\n                items.name,\n                advertisements.description,\n                used_items.price,\n                GROUP_CONCAT(files.file_name) AS files\n            FROM advertisements\n                INNER JOIN used_items ON advertisements.used_item_id = used_items.id\n                INNER JOIN items ON used_items.item_id = items.id\n                INNER JOIN ad_files ON advertisements.id = ad_files.ad_id\n                INNER JOIN files ON ad_files.file_id = files.id\n            GROUP BY advertisements.id;")];
                case 3:
                    _a = __read.apply(void 0, [_b.sent(), 1]), results = _a[0];
                    if (results.length > 0) {
                        res.status(200).send(results);
                        return [2 /*return*/];
                    }
                    ;
                    res.status(404).send("Nincsenek lekérendő hirdetések.");
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _b.sent();
                    console.log(err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
;
function getAdDatasById(req, res) {
    var id = parseInt(req.params.adId);
    idIsNan(id, res);
    var result = data_1.default.find(function (a) { return a.adId === id; });
    if (result) {
        res.status(200).send(result);
        return;
    }
    ;
    res.status(404).send("Nincs ilyen azonosítójú elem.");
}
;
function getUserAds(req, res) {
    var userName = req.params.userName;
    var userResult = data_1.default.some(function (u) { return u.userName === userName; });
    if (!userResult) {
        res.status(404).send("Ez a felhasználó még nem töltött fel hirdetéseket vagy nem létezik.");
        return;
    }
    ;
    var results = data_1.default.filter(function (i) { return i.userName === userName; });
    if (results.length > 0) {
        res.status(200).send(results);
        return;
    }
    ;
    res.status(400).send("Nincsenek még hirdetések.");
}
;
function getUserAdById(req, res) {
    var userName = req.params.userName;
    var adId = parseInt(req.params.adId);
    idIsNan(adId, res);
    var userResult = data_1.default.some(function (u) { return u.userName === userName; });
    if (!userResult) {
        res.status(404).send("Nem létezik ilyen felhasználó.");
        return;
    }
    ;
    var results = data_1.default.find(function (i) { return i.userName === userName && i.adId === adId; });
    if (results) {
        res.status(200).send(results);
        return;
    }
    ;
    res.status(400).send("Nem létezik ilyen hirdetés.");
}
;
