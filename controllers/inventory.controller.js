const prisma = require('../prisma')

exports.createIngredient = async (req, res) => {
    try {
        const { name, unit, currentStock, lowStockLevel } = req.body
        const vendorId = req.user.id

        const ingredient = await prisma.ingredient.create({
            data: {
                name,
                unit,
                currentStock,
                lowStockLevel,
                vendorId
            }
        })

        res.json(ingredient)
    } catch (err) {
        res.status(500).json({ message: 'Error creating ingredient' })
    }
}

exports.getIngredients = async (req, res) => {
    const vendorId = req.user.id

    const ingredients = await prisma.ingredient.findMany({
        where: { vendorId }
    })

    res.json(ingredients)
}

exports.manualAdjust = async (req, res) => {
    const { ingredientId, quantity } = req.body
    const vendorId = req.user.id

    await prisma.ingredient.update({
        where: { id: ingredientId },
        data: {
            currentStock: {
                increment: quantity
            }
        }
    })

    await prisma.stockMovement.create({
        data: {
            type: "MANUAL_ADJUSTMENT",
            quantity,
            ingredientId,
            vendorId
        }
    })

    res.json({ message: "Stock updated" })
}
