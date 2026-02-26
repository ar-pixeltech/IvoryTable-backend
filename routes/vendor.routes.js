const express = require("express");
const bcrypt = require("bcrypt");
const { isVendor } = require('../middleware/auth.middleware')
const jwt = require("jsonwebtoken");
const prisma = require('../prisma')

const router = express.Router();

// vendor login API
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const vendor = await prisma.vendor.findUnique({
            where: { email }
        });

        if (!vendor) return res.error("Vendor not found", 404);

        if (!vendor.isActive) return res.error("Account disabled", 403);

        const valid = await bcrypt.compare(password, vendor.password);
        if (!valid) return res.error("Invalid password", 401);

        // Check expiry
        if (vendor.trialEndsAt && new Date() > vendor.trialEndsAt)
            return res.error("Trial expired", 403);

        if (vendor.subscriptionEndsAt && new Date() > vendor.subscriptionEndsAt)
            return res.error("Subscription expired", 403);

        const token = jwt.sign(
            { id: vendor.id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.success({
            token, name: vendor.name,
            email: vendor.email,
            businessType: vendor.businessType
        }, "Login successful");

    } catch (err) {
        next(err);
    }
});

router.get("/dashboard",
    isVendor,
    async (req, res) => {
        res.json({ message: "Welcome Vendor", vendor: req.vendor });
    });




module.exports = router;
