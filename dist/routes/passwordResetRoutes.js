"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passwordResetController_1 = require("../controllers/passwordResetController");
const router = (0, express_1.Router)();
router.post("/request-reset", passwordResetController_1.requestPasswordReset);
router.post("/reset-password", passwordResetController_1.resetPassword);
exports.default = router;
