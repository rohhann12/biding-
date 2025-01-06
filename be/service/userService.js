const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userService = {
    async addObject(name, cost_price, selling_price, images) {
        try {
            const intoDb = await prisma.objects.create({
                data: {
                    name: name,
                    cost_price: cost_price,
                    selling_price: selling_price,
                    images: images
                }
            });

            if (!intoDb) {
                return { message: "No new entries added to the database" };
            }

            console.log(intoDb);
            return {
                message: `Database updated with the new object`,
                insertedData: intoDb // Return the created object
            };
        } catch (error) {
            console.error("Error inserting data into DB:", error);
            return {
                message: "Failed to update database",
                error: error.message
            };
        }
    }
};

module.exports = userService;
