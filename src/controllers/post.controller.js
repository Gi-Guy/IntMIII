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
exports.deletePost = deletePost;
exports.toggleLockPost = toggleLockPost;
exports.updatePost = updatePost;
const post_model_1 = require("../models/post.model");
const comment_model_1 = require("../models/comment.model");
const comment_controller_1 = require("./comment.controller");
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
                    username: user.username,
                },
                isLocked: false,
            };
            yield post_model_1.PostModel.create(post);
            res.status(201).json({ message: 'Post created successfully' });
        }
        catch (err) {
            res.status(500).json({ message: 'Server error', error: err });
        }
    });
}
function getAllPosts(_, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const posts = yield post_model_1.PostModel.find().sort({ createdAt: -1 }).lean();
            const enriched = yield Promise.all(posts.map((post) => __awaiter(this, void 0, void 0, function* () {
                const count = yield comment_model_1.CommentModel.countDocuments({ postId: post.id });
                return Object.assign(Object.assign({}, post), { commentCount: count });
            })));
            res.json(enriched);
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
function deletePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const post = yield post_model_1.PostModel.findOne({ id: req.params.id });
            if (!post) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }
            const user = req.user;
            if (!post.author || post.author.id !== user.id && !user.isAdmin) {
                res.status(403).json({ message: 'Forbidden' });
                return;
            }
            //await CommentModel.deleteMany({ postId: post.id });
            yield (0, comment_controller_1.deleteCommentsByPostId)(post.id);
            yield post.deleteOne();
            res.status(200).json({ message: 'Post deleted' });
        }
        catch (err) {
            res.status(500).json({ message: 'Server error', error: err });
        }
    });
}
function toggleLockPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const post = yield post_model_1.PostModel.findOne({ id: req.params.id });
            if (!post) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }
            const user = req.user;
            if (!post.author || post.author.id !== user.id && !user.isAdmin) {
                res.status(403).json({ message: 'Forbidden' });
                return;
            }
            post.isLocked = req.body.isLocked;
            yield post.save();
            res.status(200).json({ message: 'Lock state updated' });
        }
        catch (err) {
            res.status(500).json({ message: 'Server error', error: err });
        }
    });
}
function updatePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const post = yield post_model_1.PostModel.findOne({ id: req.params.id });
            if (!post) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }
            const user = req.user;
            if (!post.author || post.author.id !== user.id && !user.isAdmin) {
                res.status(403).json({ message: 'Unauthorized' });
                return;
            }
            post.title = req.body.title;
            post.content = req.body.content;
            yield post.save();
            res.status(200).json({ message: 'Post updated' });
        }
        catch (err) {
            res.status(500).json({ message: 'Server error', error: err });
        }
    });
}
