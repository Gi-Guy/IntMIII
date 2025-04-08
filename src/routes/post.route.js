"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const post_controller_1 = require("../controllers/post.controller");
const router = (0, express_1.Router)();
router.get('/', post_controller_1.getAllPosts);
router.get('/:id', post_controller_1.getPostById);
router.post('/', auth_middleware_1.authenticate, post_controller_1.createPost);
// router.delete('/:id', authenticate, isAdmin, deletePostById);
router.delete('/:id', auth_middleware_1.authenticate, post_controller_1.deletePost);
router.put('/:id/lock', auth_middleware_1.authenticate, post_controller_1.toggleLockPost);
exports.default = router;
