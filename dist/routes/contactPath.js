"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactControllers_1 = require("../controllers/contactControllers");
const router = (0, express_1.Router)();
router.post("/send-email", contactControllers_1.createContact);
exports.default = router;
