const express = require('express');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express();
const {WebSocketServer,WebSocket}=require('ws')
const redis=require('redis')
const dummy=require('../data/data')

router.use(express.json())
let redisClient;
async function connectingClient(){
    try {
        redisClient=redis.createClient({url: "redis://localhost:6379"});
        redisClient.on("error", (error) => console.error(`Error : ${error}`));
        await redisClient.connect();
        console.log("connected")
    } catch (error) {
        console.log(error)
    }
}
connectingClient();

async function addingVal(){
    try {
        const data = await prisma.objects.findMany();
        console.log("hey")
        // console.log(data)
        if (!data || data.length === 0) {
           console.log("idhr")
        }        
        const mapping = data.map(item => ({
            objectId:item.objectId,
            name: item.name,
            cost_price: item.cost_price,
            selling_price:item.selling_price
        }));
        await redisClient.set('items',JSON.stringify(mapping),(err,reply)=>{
            if(err){
                console.log(err)
            }
        });
        // const data1=await redisClient.get('items');
        // let results=JSON.parse(data1);
        // let objectId=50;
        // console.log(data1)
        // const item = results.find(i => i.objectId === objectId);
        // console.log(item)
    } catch (error) {
        console.log(error)
    }
}
async function updateVal(value){
    // sub to the queue and as values keep coming in we change the value
    try {
        // jo value ayi h woh toh update krni h lekin usi object ki hogi woh kaise krun confirm
        const updating=redisClient.set('items',objectId,cost_price,(err,reply)=>{

        })
    } catch (error) {
        
    }
}

router.post("/addData", async (req, res) => {
    try {
        const mapping = dummy.map(item => ({
            name: item.name,
            cost_price: item.cost_price,
            selling_price:item.cost_price,
            images: item.images, // Ensure you include all image URLs
        }));
    
        // Create multiple objects at once using prisma.createMany (or loop through for individual creation)
        const data = await prisma.objects.createMany({
            data: mapping, // Pass the whole array of objects for bulk creation
        });
    
        if (!data || data.count === 0) {
            return res.status(500).json({
                message: "All items sold"
            });
        }
        
        res.status(200).json({
            message: "Available items are:",
            data: mapping // Return the full mapping, which now includes all images
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }finally{
        addingVal();
    }
    
});

// hum http req bhejkr hie value update krenge
router.post("/updateVal",async(req,res)=>{
    const {price,objectId}=req.body
    try {
        const thatObject=await redisClient.get('items')
        const data = JSON.parse(thatObject);
        const item = data.find(i => i.objectId === objectId);
        console.log(item)
        const oldPrice= item.selling_price;
        console.log(oldPrice)
        if(!oldPrice){
            return res.status(400).json({
                message:"cant retrieve old value"
            })
        }
        // function newVal(price){
            
        if(price<oldPrice){
        return res.status(201).json({
                message:"amount is less than the last amount"
            })
        }else{
            // idhr redis cache mei update hoga
            item.selling_price=price
            const updateSellingPrice=await redisClient.set('items',JSON.stringify(data))
            console.log(updateSellingPrice)
            console.log(data)
            return res.status(200).json({message:`amount updated ${price}`})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"error in updating value"
        })
    }
})

// ismei redis ka logic dalne h ab ki redis mei update krta jaye yeh value ko hath ke 




// socket connect hoga worker se aur update krta rahega values

// const httpServer = router.listen(8080)

// const wss = new WebSocketServer({ server: httpServer });

// wss.on('connection', function connection(ws) {
//   ws.on('error', console.error);

//   ws.on('message', function message(data, isBinary) {
//     wss.clients.forEach(function each(client) {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(data, { binary: isBinary });
//       }
//     });
//   });

//   ws.send('Hello! Message From Server!!');
// });






router.listen(3000);
// module.exports=router