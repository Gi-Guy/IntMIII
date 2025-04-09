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
    container.className = 'post-wrapper';
    const topBar = document.getElementById("top-bar");
    topBar.innerHTML = "";
    let user = null;
    try {
        const userRes = yield fetch('/api/users/me', { credentials: 'include' });
        if (userRes.ok) {
            user = yield userRes.json();
            const createBtn = document.createElement("button");
            createBtn.textContent = "Create Post";
            createBtn.onclick = () => (window.location.href = "/post/createPost.html");
            const profileBtn = document.createElement("button");
            profileBtn.textContent = "Profile";
            profileBtn.onclick = () => (window.location.href = "/profile/profile.html");
            const logoutBtn = document.createElement("button");
            logoutBtn.textContent = "Logout";
            logoutBtn.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
                yield fetch('/api/users/logout', { credentials: 'include' });
                location.reload();
            });
            topBar.append(createBtn, profileBtn, logoutBtn);
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
    try {
        const res = yield fetch('/api/posts');
        const posts = yield res.json();
        posts.sort((a, b) => b.createdAt - a.createdAt);
        posts.forEach(post => {
            var _a;
            const postDiv = document.createElement('section');
            postDiv.className = 'post-preview';
            const title = document.createElement('h2');
            title.textContent = post.title;
            title.style.textAlign = 'center';
            const details = document.createElement('p');
            details.className = 'meta';
            details.textContent = `${new Date(post.createdAt).toLocaleString()} | ${(_a = post.commentCount) !== null && _a !== void 0 ? _a : 0} comments | by ${post.author.username}`;
            // details.textContent = `${new Date(post.createdAt).toLocaleString()} | ${post.commentCount ?? 0} comments | by ${post.author.username} | ${post.likes.length} like(s)`;
            const viewBtn = document.createElement('button');
            viewBtn.textContent = 'View';
            viewBtn.onclick = () => location.href = `post/post.html?post=${post.id}`;
            const buttons = document.createElement('div');
            buttons.appendChild(viewBtn);
            if (user && (user.id === post.author.id || user.isAdmin)) {
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
                    const confirmed = confirm('Are you sure you want to delete this post?');
                    if (!confirmed)
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
                        post.isLocked = !post.isLocked;
                        lockBtn.textContent = post.isLocked ? 'Unlock' : 'Lock';
                    }
                });
                const editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                editBtn.onclick = () => location.href = `/post/editPost.html?post=${post.id}`;
                buttons.append(editBtn, lockBtn, deleteBtn);
            }
            postDiv.append(title, details, buttons);
            container.appendChild(postDiv);
        });
    }
    catch (err) {
        container.textContent = 'Failed to load posts.';
    }
}));
