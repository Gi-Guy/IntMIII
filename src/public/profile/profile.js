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
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const usernameEl = document.getElementById('username');
    const firstNameEl = document.getElementById('firstName');
    const lastNameEl = document.getElementById('lastName');
    const birthDateEl = document.getElementById('birthDate');
    const registeredAtEl = document.getElementById('registeredAt');
    const postCountEl = document.getElementById('postCount');
    const commentCountEl = document.getElementById('commentCount');
    const postsContainer = document.getElementById('user-posts');
    const homeBtn = document.getElementById('home-btn');
    homeBtn === null || homeBtn === void 0 ? void 0 : homeBtn.addEventListener('click', () => {
        window.location.href = '/index.html';
    });
    if (homeBtn)
        homeBtn.style.backgroundColor = 'var(--secondary)';
    homeBtn.onclick = () => location.href = '/index.html';
    let user = null;
    try {
        const userRes = yield fetch('/api/users/me', { credentials: 'include' });
        user = yield userRes.json();
        usernameEl.textContent = user.username;
        firstNameEl.textContent = user.firstName;
        lastNameEl.textContent = user.lastName;
        birthDateEl.textContent = new Date(user.birthDate).toLocaleDateString();
        registeredAtEl.textContent = new Date(user.registeredAt).toLocaleString();
    }
    catch (_a) {
        alert('User not logged in');
        location.href = '/login/login.html';
    }
    try {
        const postRes = yield fetch('/api/posts', { credentials: 'include' });
        const allPosts = yield postRes.json();
        const userPosts = allPosts.filter((p) => p.author.id === user.id);
        postCountEl.textContent = userPosts.length.toString();
        userPosts.forEach((post) => {
            var _a;
            const section = document.createElement('section');
            section.className = 'post-preview';
            const title = document.createElement('h3');
            title.textContent = post.title;
            title.style.textAlign = 'center';
            const details = document.createElement('p');
            details.className = 'meta';
            details.textContent = `${new Date(post.createdAt).toLocaleString()} | ${(_a = post.commentCount) !== null && _a !== void 0 ? _a : 0} comments`;
            const viewBtn = document.createElement('button');
            viewBtn.textContent = 'View';
            viewBtn.onclick = () => location.href = `/post/post.html?post=${post.id}`;
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => location.href = `/post/editPost.html?post=${post.id}`;
            const lockBtn = document.createElement('button');
            lockBtn.textContent = post.isLocked ? 'Unlock' : 'Lock';
            lockBtn.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield fetch(`/api/posts/${post.id}/lock`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ isLocked: !post.isLocked })
                });
                if (res.ok) {
                    lockBtn.textContent = post.isLocked ? 'Lock' : 'Unlock';
                    post.isLocked = !post.isLocked;
                }
            });
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
                if (!confirm('Delete this post?'))
                    return;
                const res = yield fetch(`/api/posts/${post.id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (res.ok) {
                    section.remove();
                }
            });
            const buttonRow = document.createElement('div');
            buttonRow.style.display = 'flex';
            buttonRow.style.gap = '0.5rem';
            buttonRow.append(viewBtn, editBtn, lockBtn, deleteBtn);
            section.append(title, details, buttonRow);
            postsContainer.appendChild(section);
        });
    }
    catch (_b) {
        postCountEl.textContent = '0';
    }
    try {
        const commentRes = yield fetch('/api/comments', { credentials: 'include' });
        const allComments = yield commentRes.json();
        const userComments = allComments.filter((c) => c.author.id === user.id);
        commentCountEl.textContent = userComments.length.toString();
    }
    catch (_c) {
        commentCountEl.textContent = '0';
    }
}));
