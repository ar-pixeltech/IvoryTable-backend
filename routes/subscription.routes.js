const express = require("express");
const { isAdmin } = require('../middleware/auth.middleware')

const prisma = require('../prisma')
const router = express.Router();

// Create Subscription Plan
router.post("/create", isAdmin, async (req, res) => {
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

router.get("/all", isAdmin, async (req, res, next) => {
    try {
        const plans = await prisma.subscriptionPlan.findMany({
            orderBy: { createdAt: "desc" }
        });

        res.success(plans);

    } catch (err) {
        next(err);
    }
});
router.put("/update/:id", isAdmin, async (req, res, next) => {
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

router.delete("/delete/:id", isAdmin, async (req, res, next) => {
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
