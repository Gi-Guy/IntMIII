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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = createPost;
exports.getAllPosts = getAllPosts;
exports.getPostById = getPostById;
exports.deletePostById = deletePostById;
const post_model_1 = require("../models/post.model");
const user_model_1 = require("../models/user.model");
const crypto_1 = require("crypto");
function createPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const user = yield user_model_1.UserModel.findOne({ id: userId });
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            const { title, content } = req.body;
            const post = {
                id: (0, crypto_1.randomUUID)(),
                title,
                content,
                createdAt: Date.now(),
                author: {
                    id: user.id,
                    username: user.username
                }
            };
            yield post_model_1.PostModel.create(post);
            res.status(201).json({ message: 'Post created successfully' });
        }
        catch (err) {
            res.status(500).json({ message: 'Server error', error: err });
        }
    });
}
function getAllPosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const posts = yield post_model_1.PostModel.find().sort({ createdAt: -1 });
            res.status(200).json(posts);
        }
        catch (err) {
            res.status(500).json({ message: 'Server error', error: err });
        }
    });
}
function getPostById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const post = yield post_model_1.PostModel.findOne({ id });
            if (!post) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }
            res.status(200).json(post);
        }
        catch (err) {
            res.status(500).json({ message: 'Server error', error: err });
        }
    });
}
function deletePostById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            if (!user) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const post = yield post_model_1.PostModel.findOne({ id });
            if (!post) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }
            if (!post.author || post.author.id !== user.id && !user.isAdmin) {
                res.status(403).json({ message: 'Permission denied' });
                return;
            }
            yield post_model_1.PostModel.deleteOne({ id });
            res.status(200).json({ message: 'Post deleted successfully' });
        }
        catch (err) {
            res.status(500).json({ message: 'Server error', error: err });
        }
    });
}
