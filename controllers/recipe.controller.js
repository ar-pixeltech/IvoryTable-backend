const prisma = require('../prisma')

exports.createRecipe = async (req, res) => {
    const { menuItemId, ingredients } = req.body
    const vendorId = req.user.id

    const recipe = await prisma.recipe.create({
        data: {
            menuItemId,
            vendorId,
            ingredients: {
                create: ingredients
            }
        }
    })

    res.json(recipe)
}
