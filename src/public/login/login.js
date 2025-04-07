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
    const form = document.getElementById('login-form');
    const message = document.getElementById('message');
    const toRegister = document.getElementById('to-register');
    form.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        try {
            const res = yield fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = yield res.json();
            if (res.ok) {
                message.textContent = 'Login successful!';
                message.style.color = 'var(--text)';
                window.location.href = '/index.html';
            }
            else {
                message.textContent = result.message || 'Invalid credentials';
                message.style.color = 'var(--text)';
            }
        }
        catch (err) {
            message.textContent = 'Login request failed.';
            message.style.color = 'var(--text)';
        }
    }));
    toRegister === null || toRegister === void 0 ? void 0 : toRegister.addEventListener('click', () => {
        window.location.href = '/register/register.html';
    });
});
