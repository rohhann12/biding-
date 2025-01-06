const express = require('express');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express();
const bidingController=require('../controllers/bidingController')
router.use(express.json())


async function addingVal(){
    try {
        const data = await prisma.objects.findMany();
        console.log("hey")
        console.log(data)
        if (!data || data.length === 0) {
           console.log("idhr")
        }        
        const mapping = data.map(item => ({
            objectId:item.objectId,
            name: item.name,
            cost_price: item.cost_price,
            selling_price:item.selling_price
        }));
        console.log(mapping)
        await redisClient.set('items',JSON.stringify(mapping),(err,reply)=>{
            if(err){
                console.log(err)
            }
        });
    } catch (error) {
        console.log(error)
    }
}

router.post("/updateVal", (req, res) => {
    bidingController.updateValue(req, res);
});



router.listen(3000);