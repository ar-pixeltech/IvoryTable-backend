const jwt = require("jsonwebtoken");
const prisma = require('../prisma')


module.exports = async function (req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const admin = await prisma.admin.findUnique({
            where: { id: decoded.id }
        });

        if (!admin) {
            return res.status(403).json({ message: "Not authorized" });
        }

        req.admin = admin;
        next();

    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};
