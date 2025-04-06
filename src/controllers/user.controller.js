// src/controllers/user.controller.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { randomUUID } from 'crypto';
import { JWT_SECRET_KEY } from '../app';
export function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, password, firstName, lastName, birthDate, gender } = req.body;
            const existing = yield UserModel.findOne({ username });
            if (existing) {
                res.status(409).json({ message: 'Username already exists' });
                return;
            }
            const hashed = yield bcrypt.hash(password, 10);
            const user = {
                id: randomUUID(),
                username,
                password: hashed,
                firstName,
                lastName,
                birthDate: new Date(birthDate),
                gender,
                isAdmin: false,
                registeredAt: Date.now()
            };
            yield UserModel.create(user);
            res.status(201).json({ message: 'User registered successfully' });
        }
        catch (err) {
            res.status(500).json({ message: 'Server error', error: err });
        }
    });
}
export function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, password } = req.body;
            const user = yield UserModel.findOne({ username });
            if (!user) {
                res.status(401).json({ message: 'Invalid username or password' });
                return;
            }
            const isMatch = yield bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({ message: 'Invalid username or password' });
                return;
            }
            const token = jwt.sign({ id: user.id, username: user.username, isAdmin: user.isAdmin }, JWT_SECRET_KEY, {
                expiresIn: '1h'
            });
            res.status(200).json({ token });
        }
        catch (err) {
            res.status(500).json({ message: 'Server error', error: err });
        }
    });
}
export function getCurrentUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const user = yield UserModel.findOne({ id: userId }).select('-password');
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json(user);
        }
        catch (err) {
            res.status(500).json({ message: 'Server error', error: err });
        }
    });
}
export function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield UserModel.find().select('-password');
            res.status(200).json(users);
        }
        catch (err) {
            res.status(500).json({ message: 'Server error', error: err });
        }
    });
}
