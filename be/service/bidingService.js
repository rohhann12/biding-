const { getRedisClient,connectingClient } = require('../config/redisClient');

const userService={
    async  updateVal(price, objectId) {
        try {
            await connectingClient()
            const redisClient = await getRedisClient(); 
            const thatObject = await redisClient.get('items');
            const data = JSON.parse(thatObject);
    
            const item = data.find(i => i.objectId === objectId);
            if (!item) {
                return { status: 404, message: "Object not found" };
            }
    
            const oldPrice = item.cost_price;
            const currentSellingPrice = item.selling_price;
    
            if (!oldPrice || !currentSellingPrice) {
                return { status: 400, message: "Cannot retrieve necessary values" };
            }
    
            if (price < currentSellingPrice) {
                return { status: 400, message: "Amount is less than the last amount" };
            } else if (price === currentSellingPrice) {
                return { status: 400, message: "Amount is same, please quote higher amount" };
            }
    
            item.selling_price = price;
    
            const event = {
                objectId,
                cost_price: oldPrice,
                selling_price: price,
                timestamp: new Date().toISOString(),
            };
    
            const que=await redisClient.lPush("eventsQueue", JSON.stringify(event));
            console.log(que)
            return { status: 200, message: `Amount updated to ${price}` };
        } catch (error) {
            console.error("Service Error:", error);
            return { status: 500, message: "Error in updating value" };
        }
    }
}

module.exports = userService

