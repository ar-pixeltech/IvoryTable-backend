const express = require("express");
const { isVendor } = require('../middleware/auth.middleware')
const prisma = require('../prisma')

const router = express.Router();

router.post("/category/create", isVendor, async (req, res, next) => {
    try {
        const { name } = req.body;

        const category = await prisma.menuCategory.create({
            data: {
                name,
                vendorId: req.vendor.id
            }
        });

        res.success(category, "Category created");
    } catch (err) {
        next(err);
    }
});

router.get("/category/all", isVendor, async (req, res, next) => {
    try {
        const categories = await prisma.menuCategory.findMany({
            where: { vendorId: req.vendor.id },
            orderBy: { createdAt: "desc" }
        });

        res.success(categories);
    } catch (err) {
        next(err);
    }
});

router.put("/category/update/:id", isVendor, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, isActive } = req.body;

        const category = await prisma.menuCategory.update({
            where: { id },
            data: { name, isActive }
        });

        res.success(category, "Category updated");
    } catch (err) {
        next(err);
    }
});

router.delete("/category/delete/:id", isVendor, async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.menuCategory.delete({
            where: { id }
        });

        res.success(null, "Category deleted");
    } catch (err) {
        next(err);
    }
});


router.put("/category/reorder", isVendor, async (req, res, next) => {
    try {
        const { items } = req.body;

        const updatePromises = items.map(item =>
            prisma.menuCategory.update({
                where: { id: item.id },
                data: { position: item.position }
            })
        );

        await Promise.all(updatePromises);

        res.success(null, "Categories reordered");
    } catch (err) {
        next(err);
    }
});

// MENU ITEM ROUTES

router.post("/item/create", isVendor, async (req, res, next) => {
    try {
        const { name, price, description, categoryId } = req.body;

        const item = await prisma.menuItem.create({
            data: {
                name,
                price,
                description,
                categoryId,
                vendorId: req.vendor.id
            }
        });

        res.success(item, "Item created");
    } catch (err) {
        next(err);
    }
});

router.get("/item/all", isVendor, async (req, res, next) => {
    try {
        const items = await prisma.menuItem.findMany({
            where: { vendorId: req.vendor.id },
            include: {
                category: true
            },
            orderBy: { createdAt: "desc" }
        });

        res.success(items);
    } catch (err) {
        next(err);
    }
});


router.put("/item/update/:id", isVendor, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, price, description, isAvailable } = req.body;

        const updated = await prisma.menuItem.update({
            where: { id },
            data: { name, price, description, isAvailable }
        });

        res.success(updated, "Item updated");
    } catch (err) {
        next(err);
    }
});


router.delete("/item/delete/:id", isVendor, async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.menuItem.delete({
            where: { id }
        });

        res.success(null, "Item deleted");
    } catch (err) {
        next(err);
    }
});

module.exports = router;