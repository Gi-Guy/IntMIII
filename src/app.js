import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import userRouter from './routes/user.route';
import postRouter from './routes/post.route';
import commentRouter from './routes/comment.route';
const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb+srv://guygips:INT56789@bloodyint.vnsgnuk.mongodb.net/?retryWrites=true&w=majority&appName=BloodyInt';
const JWT_SECRET = 'super-secret-key';
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(MONGO_URI)
    .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('MongoDB connection error:', err);
});
export const JWT_SECRET_KEY = JWT_SECRET;
export default app;
