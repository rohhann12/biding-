const userService = require('../service/bidingService');

const bidingController = {
    async updateValue(req, res) {
        const { price, objectId } = req.body;
        try {
            const data = await userService.updateVal(price, objectId);
            return res.status(200).json({ message: data.message });
        } catch (error) {
            console.error("Controller Error:", error);
            return res.status(500).json({ message: "Something went wrong" });
        }
    },
};

module.exports = bidingController;
