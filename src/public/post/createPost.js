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
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('create-post-form');
    const message = document.getElementById('message');
    const homeBtn = document.getElementById('home-btn');
    homeBtn === null || homeBtn === void 0 ? void 0 : homeBtn.addEventListener('click', () => {
        window.location.href = '/index.html';
    });
    form.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        try {
            const res = yield fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include'
            });
            const result = yield res.json();
            if (res.ok) {
                message.textContent = 'Post created successfully!';
                message.style.color = 'var(--accent)';
                form.reset();
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 1000);
            }
            else {
                message.textContent = result.message || 'Error creating post.';
                message.style.color = 'var(--text)';
            }
        }
        catch (err) {
            message.textContent = 'Request failed.';
            message.style.color = 'var(--text)';
        }
    }));
});
