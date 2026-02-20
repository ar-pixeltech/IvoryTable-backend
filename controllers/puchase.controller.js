const prisma = require('../prisma')

exports.createPurchase = async (req, res) => {
    const { items } = req.body
    const vendorId = req.user.id

    let totalCost = 0

    for (let item of items) {
        totalCost += item.cost * item.quantity
    }

    const purchase = await prisma.purchase.create({
        data: {
            totalCost,
            vendorId,
            items: {
                create: items
            }
        }
    })

    for (let item of items) {
        await prisma.ingredient.update({
            where: { id: item.ingredientId },
            data: {
                currentStock: {
                    increment: item.quantity
                }
            }
        })

        await prisma.stockMovement.create({
            data: {
                type: "PURCHASE",
                quantity: item.quantity,
                ingredientId: item.ingredientId,
                vendorId
            }
        })
    }

    res.json(purchase)
}
