"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var advertisementController_1 = require("./advertisementController");
var router = (0, express_1.Router)();
router.get('/backstagegear/ads', advertisementController_1.getAds);
exports.default = router;
