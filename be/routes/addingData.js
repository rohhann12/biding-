const {userController}=require('../controllers/userController')

router.get("/addItems",  (req, res) => {
    userController.addValues(req,res)
});


module.exports=router