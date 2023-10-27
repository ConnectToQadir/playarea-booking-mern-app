const jwt = require('jsonwebtoken')
const UsersModel = require('../models/users')


async function authenticateUser(req,res,next){
    try {
        if(!req.cookies.accessToken){
            res.status(403).json({
                success:false,
                message:"Access Token Not Provided"
            })
            return
        }
        

        const tokenData = jwt.verify(req.cookies.accessToken,process.env.SECRET_KEY)
        const user = await UsersModel.findById(tokenData.id,{password:0})
        req.user = user

        next()
    } catch (error) {
        res.status(403).json({
            success:false,
            message:"Invalid Token Provided!"
        })
    }
}

module.exports = authenticateUser