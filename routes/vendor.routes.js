const express = require("express");
const bcrypt = require("bcrypt");
const { isAdmin, isVendor } = require('../middleware/auth.middleware')
const jwt = require("jsonwebtoken");
const prisma = require('../prisma')

const router = express.Router();

// Create Vendor
router.post("/create", isAdmin, async (req, res, next) => {
    try {
        const { name, phone, email, password, subscriptionId } = req.body;

        const plan = await prisma.subscriptionPlan.findUnique({
            where: { id: subscriptionId }
        });

        if (!plan) return res.error("Invalid plan", 400);

        const hashedPassword = await bcrypt.hash(password, 10);

        let subscriptionEndsAt = null;
        let trialEndsAt = null;

        if (plan.isTrial) {
            trialEndsAt = new Date();
            trialEndsAt.setDate(trialEndsAt.getDate() + plan.durationDays);
        } else {
            subscriptionEndsAt = new Date();
            subscriptionEndsAt.setDate(subscriptionEndsAt.getDate() + plan.durationDays);
        }

        const vendor = await prisma.vendor.create({
            data: {
                name,
                phone,
                email,
                password: hashedPassword,
                subscriptionId,
                subscriptionEndsAt,
                trialEndsAt
            }
        });

        res.success(vendor, "Vendor created");

    } catch (err) {
        next(err);
    }
});


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

        res.success({ token }, "Login successful");

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
