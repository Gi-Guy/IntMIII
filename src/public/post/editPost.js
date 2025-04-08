"use strict";
// public/post/editPost.ts
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
    const form = document.getElementById('edit-post-form');
    const message = document.getElementById('edit-message');
    const titleInput = form.elements.namedItem('title');
    const contentInput = form.elements.namedItem('content');
    // Home button
    const homeBtn = document.getElementById('home-btn');
    homeBtn === null || homeBtn === void 0 ? void 0 : homeBtn.addEventListener('click', () => {
        window.location.href = '/index.html';
    });
    // const homeBtn = document.getElementById('home-btn')!;
    // homeBtn.onclick = () => location.href = '/index.html';
    try {
        const res = yield fetch(`/api/posts/${postId}`);
        const post = yield res.json();
        titleInput.value = post.title;
        contentInput.value = post.content;
    }
    catch (_a) {
        message.textContent = 'Failed to load post';
    }
    form.onsubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        try {
            const res = yield fetch(`/api/posts/${postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title: titleInput.value,
                    content: contentInput.value
                })
            });
            const result = yield res.json();
            if (res.ok) {
                window.location.href = `/post/post.html?post=${postId}`;
            }
            else {
                message.textContent = result.message;
                message.style.color = 'var(--text)';
            }
        }
        catch (_a) {
            message.textContent = 'Update failed';
            message.style.color = 'var(--text)';
        }
    });
}));
