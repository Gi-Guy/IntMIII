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
const user_model_1 = require("../models/user.model");
const post_model_1 = require("../models/post.model");
const crypto_1 = require("crypto");
// export async function createComment(req: Request, res: Response): Promise<void> {
//   try {
//     const user = (req as any).user;
//     if (!user) {
//       res.status(401).json({ message: 'Unauthorized' });
//       return;
//     }
//     const { postId, content } = req.body;
//     const comment: Comment = {
//       id: randomUUID(),
//       postId,
//       content,
//       createdAt: Date.now(),
//       author: {
//         id: user.id,
//         username: user.username
//       }
//     };
//     await CommentModel.create(comment);
//     res.status(201).json({ message: 'Comment added' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err });
//   }
// }
function createComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { content, postId } = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!content || !postId || !userId) {
                res.status(400).json({ message: 'Missing required fields' });
                return;
            }
            const user = yield user_model_1.UserModel.findOne({ id: userId });
            const post = yield post_model_1.PostModel.findOne({ id: postId });
            if (!user || !post) {
                res.status(404).json({ message: 'User or Post not found' });
                return;
            }
            const comment = {
                id: (0, crypto_1.randomUUID)(),
                content,
                createdAt: Date.now(),
                author: {
                    id: user.id,
                    username: user.username
                },
                postId: post.id
            };
            yield comment_model_1.CommentModel.create(comment);
            res.status(201).json({ message: 'Comment added', comment });
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
