"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("../app");
const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        res.status(401).json({ message: 'Missing token' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, app_1.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};
exports.authenticate = authenticate;
