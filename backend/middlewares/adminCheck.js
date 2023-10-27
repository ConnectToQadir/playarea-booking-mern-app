function adminCheck(req,res,next){
    try {
       
        if(req.user.role !== "admin"){
            res.status(403).json({
                success:false,
                message:"You are not an admin User!"
            })
            return
        }
        next()

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Somethine went wrong! Please try again later."
        })
    }
}


module.exports = adminCheck