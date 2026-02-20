const jwt = require('jsonwebtoken')
const prisma = require('../prisma')


/**
 * 2️⃣ Admin Only Middleware
 */
const isAdmin = async (req, res, next) => {
    try {
        //  if (req.user.role !== 'ADMIN') {
        //     return res.status(403).json({ message: 'Admin access only' })
        // }

        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const admin = await prisma.admin.findUnique({
            where: { id: decoded.id }
        });


        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' })
        }

        req.admin = admin;
        next();

    } catch (error) {
        // res.status(401).json({ message: "Unauthorized" });
        return res.status(500).json({ message: 'Admin verification failed' })
    }


}


/**
 * 3️⃣ Vendor Only Middleware
 */
const isVendor = async (req, res, next) => {
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
            return res.status(403).json({ message: "Vendor account is disabled" });
        }

        // Trial Check
        if (vendor.trialEndsAt && new Date() > vendor.trialEndsAt) {
            return res.status(403).json({ message: "Trial expired" });
        }

        // 🔥 Optional: Subscription check
        if (vendor.subscriptionEndsAt && vendor.subscriptionEndsAt < new Date()) {
            return res.status(403).json({ message: 'Subscription expired' })
        }

        req.vendor = vendor;
        next();

    } catch (error) {
        return res.status(500).json({ message: 'Vendor verification failed' })
    }
}


module.exports = {
    isAdmin,
    isVendor
}
