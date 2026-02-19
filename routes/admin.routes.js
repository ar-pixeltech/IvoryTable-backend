const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const rateLimiter = require("../middleware/rateLimiter");

const prisma = new PrismaClient();
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
    // rateLimiter, 
    async (req, res) => {
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

            const token = jwt.sign({ id: admin.id }, "SECRET", { expiresIn: "1d" });

            // res.json({ token });
            res.success({ token }, "Login successful");
        } catch (error) {
            next(error);
        }


    });

module.exports = router;
