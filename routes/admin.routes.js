const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const rateLimiter = require("../middleware/rateLimiter");
const prisma = require('../prisma')
const { isAdmin } = require('../middleware/auth.middleware')
const { ApiError, handlePrismaError } = require('../utlis/ApiError')
const { vendorWithSubscriptionSelect } = require('../constants/vendor.select')

const router = express.Router();

// Register Admin
router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
        data: { email, password: hashedPassword }
    });

    res.success(admin, "Admin registered successfully");
});

// Login
router.post("/login",
    rateLimiter,
    async (req, res, next) => {
        console.log("Admin login attempt:", req.body);
        try {
            const { email, password } = req.body;

            const admin = await prisma.admin.findUnique({ where: { email } });
            if (!admin) {
                return res.error("Admin not found", 404);
            }

            const valid = await bcrypt.compare(password, admin.password);
            if (!valid) {
                return res.error("Invalid password", 401);
            }

            const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

            res.success({ token, email: admin.email }, "Login successful");
        } catch (error) {
            next(error);
        }

    });

// Create Vendor
router.post("/vendor/create", isAdmin, async (req, res, next) => {
    try {
        const { name, phone, email, password, subscriptionId, businessType } = req.body;

        // Check for existing email
        const existing = await prisma.vendor.findUnique({ where: { email } });
        if (existing) return next(new ApiError("Email already exists", 409));

        const plan = await prisma.subscriptionPlan.findUnique({
            where: { id: subscriptionId }
        });

        if (!plan) return next(new ApiError("Invalid plan", 400));

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
                trialEndsAt,
                businessType
            }
        });

        res.success(vendor, "Vendor created");

    } catch (err) {
        next(handlePrismaError(err));
    }
});


// Vendor List API (for admin)
router.get("/vendor/list", isAdmin, async (req, res, next) => {
    try {
        const vendors = await prisma.vendor.findMany({
            select: vendorWithSubscriptionSelect,
            orderBy: { createdAt: "desc" }
        });
        res.success(vendors);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
