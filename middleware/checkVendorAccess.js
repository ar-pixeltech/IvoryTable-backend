const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = async function (req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const vendor = await prisma.vendor.findUnique({
            where: { id: decoded.id },
            include: { subscription: true }
        });

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        if (!vendor.isActive) {
            return res.status(403).json({ message: "Account disabled" });
        }

        // Trial Check
        if (vendor.trialEndsAt && new Date() > vendor.trialEndsAt) {
            return res.status(403).json({ message: "Trial expired" });
        }

        req.vendor = vendor;
        next();

    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};
