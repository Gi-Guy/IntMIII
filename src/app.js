"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET_KEY = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
const comment_route_1 = __importDefault(require("./routes/comment.route"));
const app = (0, express_1.default)();
const PORT = 3000;
const MONGO_URI = 'mongodb+srv://guygips:INT56789@bloodyint.vnsgnuk.mongodb.net/?retryWrites=true&w=majority&appName=BloodyInt';
const JWT_SECRET = 'super-secret-key';
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/users', user_route_1.default);
app.use('/api/posts', post_route_1.default);
app.use('/api/comments', comment_route_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
mongoose_1.default.connect(MONGO_URI)
    .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('MongoDB connection error:', err);
});
exports.JWT_SECRET_KEY = JWT_SECRET;
exports.default = app;
