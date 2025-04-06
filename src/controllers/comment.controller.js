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
exports.createComment = createComment;
exports.getCommentsByPostId = getCommentsByPostId;
exports.deleteComment = deleteComment;
exports.updateComment = updateComment;
const comment_model_1 = require("../models/comment.model");
const crypto_1 = require("crypto");
function createComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            if (!user) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const { postId, content } = req.body;
            const comment = {
                id: (0, crypto_1.randomUUID)(),
                postId,
                content,
                createdAt: Date.now(),
                author: {
                    id: user.id,
                    username: user.username
                }
            };
            yield comment_model_1.CommentModel.create(comment);
            res.status(201).json({ message: 'Comment added' });
        }
        catch (err) {
            res.status(500).json({ message: 'Server error', error: err });
        }
    });
}
function getCommentsByPostId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { postId } = req.params;
            const comments = yield comment_model_1.CommentModel.find({ postId }).sort({ createdAt: 1 });
            res.status(200).json(comments);
        }
        catch (err) {
            res.status(500).json({ message: 'Server error', error: err });
        }
    });
}
function deleteComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const { id } = req.params;
            const comment = yield comment_model_1.CommentModel.findOne({ id });
            if (!comment) {
                res.status(404).json({ message: 'Comment not found' });
                return;
            }
            if (!comment.author || comment.author.id !== user.id && !user.isAdmin) {
                res.status(403).json({ message: 'Permission denied' });
                return;
            }
            yield comment_model_1.CommentModel.deleteOne({ id });
            res.status(200).json({ message: 'Comment deleted' });
        }
        catch (err) {
            res.status(500).json({ message: 'Server error', error: err });
        }
    });
}
function updateComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const { id } = req.params;
            const { content } = req.body;
            const comment = yield comment_model_1.CommentModel.findOne({ id });
            if (!comment) {
                res.status(404).json({ message: 'Comment not found' });
                return;
            }
            if (!comment.author || (comment.author.id !== user.id && !user.isAdmin)) {
                res.status(403).json({ message: 'Permission denied' });
                return;
            }
            comment.content = content;
            comment.createdAt = Date.now();
            yield comment.save();
            res.status(200).json({ message: 'Comment updated' });
        }
        catch (err) {
            res.status(500).json({ message: 'Server error', error: err });
        }
    });
}
