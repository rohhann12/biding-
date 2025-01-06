const express = require('express');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {connectingClient}=require('../config/redisClient')

async function processQueue() {
    try {
        const redisClient=connectingClient()
        while (true) {
            
            const event = await redisClient.rPop("eventsQueue");
            if (event) {
                const event = JSON.parse(event);
                console.log("Processing event:", event);
                await prisma.objects.update({
                    where:{objectId:event.objectId},

                    data:{
                        selling_price:event.selling_price
                    }
                })
                const cacheData = await redisClient.get('items');
            if (cacheData) {
                const items = JSON.parse(cacheData);
                const itemIndex = items.findIndex(item => item.objectId === event.objectId);
                if (itemIndex !== -1) {
                    items[itemIndex].selling_price = event.selling_price;
                    await redisClient.set('items', JSON.stringify(items));
                    console.log("Redis cache updated");
                }
                console.log(`value updated in db ${event.selling_price}`)
            }
            // TO-DO
            // idhr ka logic dekhna agr worker down h toh kaise sort krna
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    } catch (error) {
        console.error("Error while processing queue:", error);
    }
}


module.exports=processQueue