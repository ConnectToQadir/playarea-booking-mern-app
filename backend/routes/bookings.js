const BookingsModel = require("../models/booking");
const UsersModel = require("../models/users");
const PlayareasModel = require("../models/playareas");
const router = require("express").Router();
const authenticateUser = require("../middlewares/authenticateUser");
const adminPlusOwnerCheck = require('../middlewares/adminPlusOwnerCheck')
const { startOfDay, endOfDay } = require('date-fns')

// Booking Playarea
router.post("/",authenticateUser , async (req, res) => {

  var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday" ,"Friday","Saturday"]

  try {

    if(!req.body.bookingDate){
      res.status(400).json({
        success:false,
        message:"Booking Date is Required!"
      })
      return
    }

    // find playarea by id
    if(!req.body.playarea){
      res.status(400).json({
        success:false,
        message:"Playarea ID is required in 'playarea' field!"
      })
      return
    }
    var foundPlayarea = await PlayareasModel.findById(req.body.playarea)
    if(!foundPlayarea){
      res.status(404).json({
        success:false,
        message:"Playarea not found!"
      })
      return
    }


    // ensuring playarea is open at that day
    var bookingDayName = days[new Date(req.body.bookingDate).getDay()]
    if(!foundPlayarea.openingHours.find((v)=>v.day==bookingDayName)){
      res.status(404).json({
        success:false,
        message:`You are Booking playarea at '${new Date(req.body.bookingDate).toDateString()}' which is Playarea off day!`
      })
      return
    }

    // ensuring playarea is not booked already
    var alreadyBookedPlayarea = await BookingsModel.findOne({status:"confirmed" ,bookingDate:{ $gte: startOfDay(new Date(req.body.bookingDate)), $lt: endOfDay(new Date(req.body.bookingDate)) }})
    if(alreadyBookedPlayarea){
      res.status(400).json({
        success:false,
        message:`Playarea Already Booked at '${new Date(req.body.bookingDate).toDateString()}'`
      })
      return
    }


    // Finally Booking Playarea
    var booking = await BookingsModel.create({...req.body,bookingUser:req.user._id,owner:foundPlayarea.owner});
    res.json({
      success:true,
      message:"Playarea Booked Successfully! Kindly wait untill Owner Approve Booking."
    })


  } catch (error) {
    // Duplication Error Handling
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: "Title already in use!",
      });
      return;
    }

    // Required Fields Errors Handling
    if (error.message.split(",")[0]?.split(":")[2]?.trim()) {
      res.status(400).json({
        success: false,
        message: error.message.split(",")[0]?.split(":")[2]?.trim(),
      });
      return;
    }

    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
    });
  }
});

// Get All Bookings
router.get("/",authenticateUser, async (req,res)=>{
  try {

    
    var bookings

    if(req.user.role === "admin"){
      bookings = await BookingsModel.aggregate([
        {$lookup:{from:"users",localField:"bookingUser",foreignField:"_id",as:"bookingUser"}},
        {$lookup:{from:"users",localField:"owner",foreignField:"_id",as:"owner"}},
        {$lookup:{from:"playareas",localField:"playarea",foreignField:"_id",as:"playarea"}},
        {$sort:{createdAt:-1}}
      ])
    }else if(req.user.role === "owner"){
      bookings = await BookingsModel.aggregate([
        {$match:{$or:[{bookingUser:req.user._id},{owner:req.user._id}]}},
        {$lookup:{from:"users",localField:"bookingUser",foreignField:"_id",as:"bookingUser"}},
        {$lookup:{from:"users",localField:"owner",foreignField:"_id",as:"owner"}},
        {$lookup:{from:"playareas",localField:"playarea",foreignField:"_id",as:"playarea"}},
        {$sort:{createdAt:-1}}
      ])
    }else{
      bookings = await BookingsModel.aggregate([
        {$match:{bookingUser:req.user._id}},
        {$lookup:{from:"users",localField:"bookingUser",foreignField:"_id",as:"bookingUser"}},
        {$lookup:{from:"users",localField:"owner",foreignField:"_id",as:"owner"}},
        {$lookup:{from:"playareas",localField:"playarea",foreignField:"_id",as:"playarea"}},
        {$sort:{createdAt:-1}}
      ])
    }

    
    res.json({
      success:true,
      message:bookings
    })


  } catch (error) {


    res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
    });


  }
})

// Change Booking Status
router.get("/change-booking-status/:id",authenticateUser, async (req,res)=>{
  try {

    
    var foundBooking = await BookingsModel.findById(req.params.id)

    if (!foundBooking) {
      res.status(404).json({
        success: false,
        message: "Booking Not Found!",
      });
      return;
    }
    

    if(req.query?.cancle){
      await BookingsModel.findByIdAndUpdate(req.params.id,{$set:{status:"cancelled"}},{new:true})
      res.json({
        success:true,
        message:"Booking Cancelled Successfully!"
      })
      return
    }

    if(foundBooking.status === "pending"){
      await BookingsModel.findByIdAndUpdate(req.params.id,{$set:{status:"confirmed"}},{new:true})
      res.json({
        success:true,
        message:"Booking Confirmed Successfully!"
      })
      return
    }else if(foundBooking.status === "confirmed" || foundBooking.status === "cancelled"){
      await BookingsModel.findByIdAndUpdate(req.params.id,{$set:{status:"pending"}},{new:true})
      res.json({
        success:true,
        message:"Booking Status Again Change to Pending Successfully!"
      })
      return
    }


  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
    });


  }
})

module.exports = router;
