const express = require('express');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const data=require('../data/data')
// add data protected route one time only data file se uthakr dalra warna manually seller has to come and put it on the site
router.post("/putAll",(req,res)=>{
    const adding=data;
    const hey=prisma.object.create({
        cost_price:adding.cost_price,
        name:adding.name,
    })
    const for_images=adding.map(index=>{
        images:adding.images[i]
    })
    if(!hey || hey.length===0){
        res.send("data empty")
    }else{

    }
})