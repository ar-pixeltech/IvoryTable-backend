const express = require("express");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const checkVendorAccess = require("../middleware/checkVendorAccess");

const prisma = new PrismaClient();
const router = express.Router();

// Create Vendor
router.post("/create", async (req, res) => {
    const { name, phone, email, password, subscriptionId } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const trialPlan = await prisma.subscriptionPlan.findFirst({
        where: { isTrial: true }
    });

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + trialPlan.durationDays);

    const vendor = await prisma.vendor.create({
        data: {
            name,
            phone,
            email,
            password: hashedPassword,
            subscriptionId,
            trialEndsAt
        }
    });

    res.json(vendor);
});



router.get("/dashboard",
    checkVendorAccess,
    async (req, res) => {
        res.json({ message: "Welcome Vendor", vendor: req.vendor });
    });


module.exports = router;
