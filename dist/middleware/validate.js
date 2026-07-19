"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
exports.errorHandler = errorHandler;
const express_validator_1 = require("express-validator");
function validate(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }
    next();
}
function errorHandler(err, _req, res, _next) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal server error" });
}
