const jwt = require("jsonwebtoken");

async function requireAuth(req, res, next) {
    try {
        const authToken = req.cookies["net-owl-auth"];

        if (!authToken) {
            throw new Error("Access Unauthorized");
        }
        const decoded = jwt.verify(authToken, process.env.AUTH_TOKEN_KEY);
        req.app.locals.uid = decoded["id"];
        req.app.locals.isAdmin = decoded["is_admin"];
        next();
    }
    catch(err) {
        res.status(401).json({
            error: err.message,
            data: null
        });
    }
    
}

module.exports = {
    requireAuth,
};