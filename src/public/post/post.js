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
    const url = new URL(window.location.href);
    const postId = url.searchParams.get('post');
    if (!postId)
        return;
    const titleEl = document.getElementById('post-title');
    const metaEl = document.getElementById('post-meta');
    const contentEl = document.getElementById('post-content');
    const commentsContainer = document.getElementById('comments-container');
    const commentBtn = document.getElementById('add-comment');
    const commentFormContainer = document.createElement('div');
    commentFormContainer.id = 'comment-form-container';
    commentsContainer.before(commentFormContainer);
    const homeBtn = document.getElementById('home-btn');
    homeBtn === null || homeBtn === void 0 ? void 0 : homeBtn.addEventListener('click', () => {
        window.location.href = '/index.html';
    });
    let user = null;
    try {
        const meRes = yield fetch('/api/users/me', { credentials: 'include' });
        if (meRes.ok) {
            user = yield meRes.json();
        }
    }
    catch (_a) { }
    let post;
    try {
        const res = yield fetch(`/api/posts/${postId}`);
        post = yield res.json();
        titleEl.textContent = post.title;
        contentEl.textContent = post.content;
        metaEl.innerHTML = `By <strong>${post.author.username}</strong> | ${new Date(post.createdAt).toLocaleString()}`;
    }
    catch (_b) {
        titleEl.textContent = 'Failed to load post';
        return;
    }
    if (post.isLocked) {
        commentBtn.style.display = 'none';
        commentFormContainer.innerHTML = `
      <div class="comment-box" style="max-width: 600px; margin: auto; text-align: center;">
        <p>This post is locked for new comments.</p>
      </div>
    `;
    }
    else {
        commentBtn.addEventListener('click', () => {
            commentBtn.style.display = 'none';
            if (!user) {
                commentFormContainer.innerHTML = `
          <div class="comment-box" style="max-width: 600px; margin: auto; text-align: center;">
            <p>Please log in to leave a comment.</p>
            <button onclick="location.href='/login/login.html'">Login</button>
          </div>
        `;
            }
            else {
                commentFormContainer.innerHTML = `
          <form id="inline-comment-form">
            <textarea name="content" placeholder="Write your comment..." required rows="4"></textarea>
            <button type="submit">Submit</button>
            <p id="comment-message"></p>
          </form>
        `;
            }
        });
    }
    document.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        const form = e.target;
        if (form.id !== 'inline-comment-form')
            return;
        e.preventDefault();
        const content = form.elements.namedItem('content').value;
        const messageEl = document.getElementById('comment-message');
        try {
            const res = yield fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, postId }),
                credentials: 'include'
            });
            const result = yield res.json();
            if (res.ok) {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment-box';
                commentDiv.innerHTML = `<p><strong>${result.comment.author.username}</strong> | ${new Date(result.comment.createdAt).toLocaleString()}</p><p>${result.comment.content}</p>`;
                commentsContainer.prepend(commentDiv);
                form.reset();
                messageEl.textContent = 'Comment added!';
                messageEl.style.color = 'var(--accent)';
            }
            else {
                messageEl.textContent = result.message || 'Error adding comment';
                messageEl.style.color = 'var(--text)';
            }
        }
        catch (_a) {
            messageEl.textContent = 'Request failed';
            messageEl.style.color = 'var(--text)';
        }
    }));
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
    catch (_c) {
        commentsContainer.textContent = 'Failed to load comments';
    }
}));
