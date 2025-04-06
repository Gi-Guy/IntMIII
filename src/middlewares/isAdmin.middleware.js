export function isAdmin(req, res, next) {
    const user = req.user;
    if (!user || !user.isAdmin) {
        res.status(403).json({ message: 'Admin access required' });
        return;
    }
    next();
}
