"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var profileController_1 = require("./profileController");
var router = (0, express_1.Router)();
router.get('/backstagegear/:userName/profile', profileController_1.getProfileDatasById);
exports.default = router;
