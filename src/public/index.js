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
    const container = document.getElementById('posts-container');
    const topBar = document.createElement('div');
    topBar.style.display = 'flex';
    topBar.style.justifyContent = 'space-between';
    topBar.style.marginBottom = '1.5rem';
    const leftButton = document.createElement('button');
    const rightButton = document.createElement('button');
    let user = null;
    try {
        const userRes = yield fetch('/api/users/me', { credentials: 'include' });
        if (userRes.ok) {
            user = yield userRes.json();
            leftButton.textContent = 'Create Post';
            leftButton.onclick = () => window.location.href = '/post/createPost.html';
            rightButton.textContent = 'Logout';
            rightButton.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
                yield fetch('/api/users/logout', { credentials: 'include' });
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
            var _a;
            const postDiv = document.createElement('section');
            postDiv.className = 'post-preview';
            const title = document.createElement('h2');
            title.textContent = post.title;
            title.style.textAlign = 'center';
            const details = document.createElement('p');
            details.className = 'meta';
            details.textContent = `${new Date(post.createdAt).toLocaleString()} | ${(_a = post.commentCount) !== null && _a !== void 0 ? _a : 0} comments | by ${post.author.username}`;
            const link = document.createElement('a');
            link.href = `post/post.html?post=${post.id}`;
            link.textContent = 'View Full Post';
            postDiv.append(title, details, link);
            if (user && (user.id === post.author.id || user.isAdmin)) {
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete Post';
                deleteBtn.style.marginLeft = '1rem';
                deleteBtn.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
                    const confirmDelete = confirm('Are you sure you want to delete this post?');
                    if (!confirmDelete)
                        return;
                    const delRes = yield fetch(`/api/posts/${post.id}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });
                    if (delRes.ok) {
                        postDiv.remove();
                    }
                    else {
                        alert('Failed to delete post');
                    }
                });
                postDiv.appendChild(deleteBtn);
                const lockBtn = document.createElement('button');
                lockBtn.textContent = post.isLocked ? 'Unlock Post' : 'Lock Post';
                lockBtn.style.marginLeft = '0.5rem';
                lockBtn.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
                    const lockRes = yield fetch(`/api/posts/${post.id}/lock`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ isLocked: !post.isLocked })
                    });
                    if (lockRes.ok) {
                        post.isLocked = !post.isLocked;
                        lockBtn.textContent = post.isLocked ? 'Unlock Post' : 'Lock Post';
                    }
                    else {
                        alert('Failed to update lock status');
                    }
                });
                postDiv.appendChild(lockBtn);
                const editBtn = document.createElement('button');
                editBtn.textContent = 'Edit Post';
                editBtn.style.marginLeft = '0.5rem';
                editBtn.onclick = () => {
                    window.location.href = `/post/editPost.html?post=${post.id}`;
                };
                postDiv.appendChild(editBtn);
            }
            container.appendChild(postDiv);
        });
    }
    catch (err) {
        container.textContent = 'Failed to load posts.';
    }
}));
