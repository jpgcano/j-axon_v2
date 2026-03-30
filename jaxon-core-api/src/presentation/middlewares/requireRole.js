export const requireRole = (allowed) => {
    return (req, res, next) => {
        const role = req.user?.role;
        if (!role) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        if (!allowed.includes(role)) {
            res.status(403).json({ error: 'Forbidden: insufficient role' });
            return;
        }
        next();
    };
};
//# sourceMappingURL=requireRole.js.map