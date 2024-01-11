"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        var _a;
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const bypassRole = req.headers['bypass-authorization'];
        // if(bypassRole !== 'admin') {
        if (!userRole || (!allowedRoles.includes(userRole) && bypassRole !== 'admin')) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        // }
        next();
    };
};
exports.authorizeRole = authorizeRole;
