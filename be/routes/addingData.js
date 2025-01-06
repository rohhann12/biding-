const express = require('express');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express();
const data = require('../data/data');

// Route to populate database with data
router.get("/putinDB", async (req, res) => {
    try {
        // Map the data to the format required by Prisma
        const mapping = data.map(item => {
            if (!item.name || !item.cost_price || !item.selling_price || !item.images) {
                throw new Error("Invalid data format");
            }
            return {
                name: item.name,
                cost_price: item.cost_price,
                selling_price: item.selling_price,
                images: item.images
            };
        });

        // Insert data into the database
        const intoDb = await prisma.objects.createMany({
            data: mapping,
            // skipDuplicates: true // Avoid duplicate entry errors
        });

        if (!intoDb.count) {
            return res.status(400).json({
                message: "No new entries added to the database"
            });
        }

        console.log(intoDb);
        res.status(200).json({
            message: `Database updated with ${intoDb.count} entries`,
            insertedData: mapping
        });
    } catch (error) {
        console.error("Error inserting data into DB:", error);
        res.status(500).json({
            message: "Failed to update database",
            error: error.message
        });
    }
});

// Start the server
const PORT = 8080;
router.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
