const express = require('express');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const ws=require('ws')

router.get("/bulk", async (req, res) => {
    try {
        const data = await prisma.object.findMany();

        if (!data || data.length === 0) {
            return res.status(500).json({
                message: "All items sold"
            });
        }

        const mapping = data.map(item => ({
            name: item.name,
            cost_price: item.cost_price
        }));

        res.status(200).json({
            message: "Available items are:",
            data: mapping
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});







module.exports=router