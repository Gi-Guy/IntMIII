# README - Blog Post Platform

## 🔧 Project Overview
A Node.js + Express + TypeScript-based blog platform with MongoDB and SCSS (CUBE CSS methodology).

### ✨ Features
- **User System**
  - Registration & Login with cookies (JWT)
  - Secure password hashing
  - Admin and regular users

- **Post Management**
  - Create, view, delete posts
  - Only the post owner or admin can delete or lock
  - Locked posts prevent new comments

- **Commenting System**
  - Users can comment on posts (unless locked)
  - Comments tied to specific posts

- **Public HTML Pages**
  - `register.html`, `login.html`, `index.html`, `createPost.html`, `post.html`
  - Navigation, conditional buttons based on auth state


### 📂 Project Structure (partial)
```
src/
├── app.ts
├── models/
│   ├── user.model.ts
│   ├── post.model.ts
│   └── comment.model.ts
├── controllers/
│   ├── user.controller.ts
│   ├── post.controller.ts
│   ├── post.lock.controller.ts
│   └── comment.controller.ts
├── routes/
│   ├── user.route.ts
│   ├── post.route.ts
│   └── comment.route.ts
├── public/
│   ├── index.html / index.ts
│   ├── register/...
│   ├── login/...
│   ├── post/post.html / post.ts
│   └── comments/addComment.html / addComment.ts
```

### 🧪 Testing
- Vitest unit tests available for `user.test.ts`, `post.test.ts`
- Test structure lives under `tests/`

### 🚀 Commands
- Start Dev: `npx ts-node src/app.ts`
- SCSS Watch: `npm run sass`
- Compile: `npm run build`
- Test: `npm run testV`

### 🔐 Lock Feature (New)
- `isLocked` boolean on posts
- Locked posts:
  - Do not show comment button
  - Show message: "This post is locked for comments."
  - Block server-side comment creation
- Managed via `PUT /api/posts/:id/lock`

