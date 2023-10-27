const router = require("express").Router();
const UsersModel = require("../models/users");
const authenticateUser = require('../middlewares/authenticateUser')
const adminCheck = require('../middlewares/adminCheck')

// Get All Users
router.get("/",authenticateUser,async(req,res)=>{
    try {
        var users = await UsersModel.find()
        res.json({
            success:true,
            message:users
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Somethine went wrong! Please try again later."
        }) 
    }
})

module.exports = router;