const jwt = require("jsonwebtoken");
const { printWarning } = require("../constants/functions");

async function requireAdmin(req, res, next) {
    try {
        if (req.app.locals.isAdmin === undefined || !req.app.locals.isAdmin) {
            throw new Error("Unauthorized Access");
        }
        
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
    requireAdmin,
};