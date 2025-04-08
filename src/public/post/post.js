"use strict";
// public/post.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const url = new URL(window.location.href);
    const postId = url.searchParams.get('post');
    if (!postId)
        return;
    const titleEl = document.getElementById('post-title');
    const metaEl = document.getElementById('post-meta');
    const contentEl = document.getElementById('post-content');
    const commentsContainer = document.getElementById('comments-container');
    const commentBtn = document.getElementById('add-comment');
    commentBtn.addEventListener('click', () => {
        window.location.href = `/comments/addComment.html?post=${postId}`;
    });
    try {
        const res = yield fetch(`/api/posts/${postId}`);
        const post = yield res.json();
        titleEl.textContent = post.title;
        contentEl.textContent = post.content;
        metaEl.innerHTML = `By <strong>${post.author.username}</strong> | ${new Date(post.createdAt).toLocaleString()}`;
    }
    catch (_a) {
        titleEl.textContent = 'Failed to load post';
    }
    try {
        const res = yield fetch(`/api/comments/post/${postId}`);
        const comments = yield res.json();
        comments.forEach(c => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment-box';
            commentDiv.innerHTML = `<p><strong>${c.author.username}</strong> | ${new Date(c.createdAt).toLocaleString()}</p><p>${c.content}</p>`;
            commentsContainer.appendChild(commentDiv);
        });
    }
    catch (_b) {
        commentsContainer.textContent = 'Failed to load comments';
    }
}));
