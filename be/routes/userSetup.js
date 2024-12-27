const express = require('express');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();

function randomUserIdGenerator(text) {
    const number = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // 4-digit random number
    const userText = text.slice(0, 4); // First 4 characters of input text
    return `${userText}${number}${Date.now()}`;
}

router.post('/getIn', async (req, res) => {
    try {
        const { username } = req.body;

        const check = await prisma.user.findUnique({
            where: { username }
        });

        if (check) {
            return res.status(400).json({
                message: "Username already taken"
            });
        }

        const userId = randomUserIdGenerator(username);

        const data = await prisma.user.create({
            data: {
                username,
                userId
            }
        });

        res.status(201).json({
            message: `Welcome, ${data.username}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;
