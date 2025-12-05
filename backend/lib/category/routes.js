"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var categoryController_1 = require("../category/categoryController");
var router = (0, express_1.Router)();
router.get('/backstagegear', categoryController_1.getCategories);
exports.default = router;
