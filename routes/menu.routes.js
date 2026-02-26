const express = require("express");
const { isVendor } = require('../middleware/auth.middleware')
const prisma = require('../prisma')

const router = express.Router();

router.post("/category/create", isVendor, async (req, res, next) => {
    try {
        const { name } = req.body;

        const category = await prisma.category.create({
            data: {
                name,
                ...(req.body.parentId ? { parentId: req.body.parentId } : {}),
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
        const categories = await prisma.category.findMany({
            where: { vendorId: req.vendor.id },
            orderBy: { position: "asc" },
            // include: {
            //     parent: true
            // }
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

        const category = await prisma.category.update({
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

        await prisma.category.delete({
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
            prisma.category.update({
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
        if (Object.keys(req.body).length === 0) {
            return res.error("Request body cannot be empty", 400);
        }

        const item = await prisma.product.create({
            data: {
                ...req.body,
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
        const { categoryId } = req.query;
        const where = { vendorId: req.vendor.id };
        if (categoryId) {
            where.categoryId = categoryId;
        }
        const items = await prisma.product.findMany({
            where,
            // include: {
            //     category: true
            // },
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

        const updated = await prisma.product.update({
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

        await prisma.product.delete({
            where: { id }
        });

        res.success(null, "Item deleted");
    } catch (err) {
        next(err);
    }
});

module.exports = router;