const express = require("express");
const { PrismaClient } = require("@prisma/client");
const checkAdmin = require("../middleware/checkAdmin");
const ApiError = require("../utlis/ApiError");

const prisma = new PrismaClient();
const router = express.Router();

// Create Subscription Plan
router.post("/create", checkAdmin, async (req, res) => {
    try {
        const { name, price, durationDays, isTrial } = req.body;

        const plan = await prisma.subscriptionPlan.create({
            data: {
                name,
                price,
                durationDays,
                isTrial
            }
        });

        res.json(plan);
    } catch (error) {
        next(new ApiError("Failed to create plan", 500));
    }
});


router.get("/all", checkAdmin, async (req, res) => {


    try {
        const plans = await prisma.subscriptionPlan.findMany({
            orderBy: { createdAt: "desc" }
        });
        res.success(plans);
    } catch (error) {
        next(new ApiError("Failed to fetch plans", 500));
    }

});

router.put("/update/:id", checkAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, price, durationDays, isTrial } = req.body;

    const updated = await prisma.subscriptionPlan.update({
        where: { id },
        data: {
            name,
            price,
            durationDays,
            isTrial
        }
    });

    //     if (isTrial) {
    //   await prisma.subscriptionPlan.updateMany({
    //     where: { isTrial: true },
    //     data: { isTrial: false }
    //   });
    // }

    res.json(updated);
});

router.delete("/delete/:id", checkAdmin, async (req, res) => {
    const { id } = req.params;

    await prisma.subscriptionPlan.delete({
        where: { id }
    });

    res.json({ message: "Plan deleted successfully" });
});

module.exports = router;
