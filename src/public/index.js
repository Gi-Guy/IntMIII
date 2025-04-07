"use strict";
// // public/index.ts
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
    const container = document.getElementById('posts-container');
    const topBar = document.createElement('div');
    topBar.style.display = 'flex';
    topBar.style.justifyContent = 'space-between';
    topBar.style.marginBottom = '1.5rem';
    const leftButton = document.createElement('button');
    const rightButton = document.createElement('button');
    try {
        const userRes = yield fetch('/api/users/me', { credentials: 'include' });
        if (userRes.ok) {
            const user = yield userRes.json();
            leftButton.textContent = 'Create Post';
            leftButton.onclick = () => window.location.href = '/createPost.html';
            rightButton.textContent = 'Logout';
            rightButton.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
                document.cookie = 'token=; Max-Age=0';
                location.reload();
            });
            topBar.append(leftButton, rightButton);
        }
        else {
            const registerBtn = document.createElement('button');
            registerBtn.textContent = 'Register';
            registerBtn.onclick = () => window.location.href = '/register/register.html';
            const loginBtn = document.createElement('button');
            loginBtn.textContent = 'Login';
            loginBtn.onclick = () => window.location.href = '/login/login.html';
            topBar.append(registerBtn, loginBtn);
        }
    }
    catch (err) {
        console.error('User check failed');
    }
    document.body.insertBefore(topBar, container);
    try {
        const res = yield fetch('/api/posts');
        const posts = yield res.json();
        posts
            .sort((a, b) => b.createdAt - a.createdAt)
            .forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post-preview';
            const title = document.createElement('h2');
            title.textContent = post.title;
            title.style.textAlign = 'center';
            const details = document.createElement('p');
            details.textContent = `${new Date(post.createdAt).toLocaleString()} | ${post.commentCount} comments | by ${post.author.username}`;
            const link = document.createElement('a');
            link.href = `/post/${post.id}.html`;
            link.textContent = 'View Full Post';
            postDiv.append(title, details, link);
            container.appendChild(postDiv);
        });
    }
    catch (err) {
        container.textContent = 'Failed to load posts.';
    }
}));
