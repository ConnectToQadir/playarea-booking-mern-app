function adminPlusOwnerCheck(req,res,next){
    try {

       
        if((req.user.role !== "admin" ) && (req.user.role !== "owner")){
            res.status(403).json({
                success:false,
                message:"You are not an admin or owner!"
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


module.exports = adminPlusOwnerCheck