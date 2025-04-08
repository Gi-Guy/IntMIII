# README - Blog Post Platform

## 🔧 Project Overview
A Node.js + Express + TypeScript-based blog platform with MongoDB.

### ✨ Features
- **User System**
  - Registration & Login with cookies (JWT)
  - Secure password hashing
  - Admin and regular users
  - View list of all users (admin only)

- **Post Management**
  - Create, view, delete, lock/unlock posts
  - Only the post owner or admin can delete or lock
  - Locked posts prevent new comments

- **Commenting System**
  - Users can comment on posts (unless locked)
  - Comments tied to specific posts
  - Only comment author or admin can delete/edit

- **Public HTML Pages**
  - `register.html`, `login.html`, `index.html`, `createPost.html`, `post.html`, `addComment.html`
  - Dynamic TS files for each page

### 📂 Full Project Structure
```
src/
├── app.ts
├── models/
│   ├── comment.model.ts
│   ├── post.model.ts
│   └── user.model.ts
├── controllers/
│   ├── comment.controller.ts
│   ├── post.controller.ts
│   ├── post.lock.controller.ts
│   └── user.controller.ts
├── routes/
│   ├── comment.route.ts
│   ├── post.route.ts
│   └── user.route.ts
├── middlewares/
│   ├── admin.middleware.ts
│   └── auth.middleware.ts
├── public/
│   ├── styles/
│   │   ├── main.css
│   │   └── main.scss
│   ├── index.html
│   ├── index.ts
│   ├── login/
│   │   ├── login.html
│   │   └── login.ts
│   ├── register/
│   │   ├── register.html
│   │   └── register.ts
│   ├── post/
│   │   ├── createPost.html
│   │   ├── createPost.ts
│   │   ├── post.html
│   │   └── post.ts
│   └── comments/
│       ├── addComment.html
│       └── addComment.ts
├── tests/
│   ├── post.test.ts
│   └── user.test.ts
```

### 🧪 Testing
- Uses Vitest with Supertest
- Unit tests for registration, login, post creation

### 🚀 Commands
- `npm run sass` - Compile SCSS
- `npm run build` - Compile TS + SCSS
- `npm start` - Build and run server
- `npm run testV` - Run tests using Vitest

### 🔐 Lock Feature
- Posts include `isLocked` boolean
- Locked posts:
  - Hide add comment button
  - Show warning message
  - Block server comment creation
