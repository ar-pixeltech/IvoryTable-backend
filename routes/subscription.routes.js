const express = require("express");
const { PrismaClient } = require("@prisma/client");
const checkAdmin = require("../middleware/checkAdmin");

const prisma = new PrismaClient();
const router = express.Router();

// Create Subscription Plan
router.post("/create", checkAdmin, async (req, res) => {
    try {
        const { name, price, durationDays, isTrial } = req.body;

        if (isTrial) {
            await prisma.subscriptionPlan.updateMany({
                where: { isTrial: true },
                data: { isTrial: false }
            });
        }

        const plan = await prisma.subscriptionPlan.create({
            data: {
                name,
                price,
                durationDays,
                isTrial
            }
        });

        res.success(plan, "Plan created successfully");

    } catch (err) {
        next(err);
    }
});

router.get("/all", checkAdmin, async (req, res, next) => {
    try {
        const plans = await prisma.subscriptionPlan.findMany({
            orderBy: { createdAt: "desc" }
        });

        res.success(plans);

    } catch (err) {
        next(err);
    }
});
router.put("/update/:id", checkAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, price, durationDays, isActive } = req.body;

        const updated = await prisma.subscriptionPlan.update({
            where: { id },
            data: { name, price, durationDays, isActive }
        });

        res.success(updated, "Plan updated");

    } catch (err) {
        next(err);
    }
});

router.delete("/delete/:id", checkAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.subscriptionPlan.delete({
            where: { id }
        });

        res.success(null, "Plan deleted");

    } catch (err) {
        next(err);
    }
});

module.exports = router;
