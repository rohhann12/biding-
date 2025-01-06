const userService=require('../service/userService')

const userController={
    async addValues(){
        const {name,cost_price,selling_price,images}=req.body
        try {
        const data=await userService.addObject(name,cost_price,selling_price,images)
        return res.status(200).json({message:data})
        }catch(er){
        console.log(er)
        return res.status(400).json({message:"something is wrong"})
        }
    }

}

module.exports=userController