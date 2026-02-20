const prisma = require('../prisma')

exports.createOrder = async (req, res) => {
    try {
        const { items, paymentMethod } = req.body
        const vendorId = req.user.id

        // 1️⃣ Calculate totals
        let totalAmount = 0

        for (let item of items) {
            const menuItem = await prisma.menuItem.findUnique({
                where: { id: item.menuItemId }
            })

            if (!menuItem) {
                return res.status(400).json({ message: 'Invalid menu item' })
            }

            totalAmount += menuItem.price * item.quantity
        }

        // 2️⃣ Create Order
        const lastOrder = await prisma.order.findFirst({
            where: { vendorId },
            orderBy: { createdAt: 'desc' }
        })

        const orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1

        const order = await prisma.order.create({
            data: {
                orderNumber,
                totalAmount,
                paymentMethod,
                vendorId,
                items: {
                    create: await Promise.all(
                        items.map(async (item) => {
                            const menuItem = await prisma.menuItem.findUnique({
                                where: { id: item.menuItemId }
                            })

                            return {
                                quantity: item.quantity,
                                price: menuItem.price,
                                subtotal: menuItem.price * item.quantity,
                                menuItemId: item.menuItemId
                            }
                        })
                    )
                }
            },
            include: { items: true }
        })

        // 3️⃣ AUTO INVENTORY DEDUCTION (Recipe Based)
        for (let item of items) {
            const recipe = await prisma.recipe.findUnique({
                where: { menuItemId: item.menuItemId },
                include: {
                    ingredients: {
                        include: { ingredient: true }
                    }
                }
            })

            if (recipe) {
                for (let ing of recipe.ingredients) {
                    const totalUsed = ing.quantityUsed * item.quantity

                    await prisma.ingredient.update({
                        where: { id: ing.ingredientId },
                        data: {
                            currentStock: {
                                decrement: totalUsed
                            }
                        }
                    })

                    await prisma.stockMovement.create({
                        data: {
                            type: "SALE",
                            quantity: totalUsed,
                            ingredientId: ing.ingredientId,
                            vendorId
                        }
                    })
                }
            }
        }

        res.json(order)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}
