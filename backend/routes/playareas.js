const router = require("express").Router();
const PlayareasModel = require("../models/playareas");
const authenticateUser = require("../middlewares/authenticateUser");
const adminPlusOwnerCheck = require("../middlewares/adminPlusOwnerCheck");
const { startOfDay, endOfDay } = require("date-fns");
const BookingsModel = require("../models/booking");
const { ObjectId } = require("mongoose").Types;
const UserModel = require('../models/users')

// Add Playarea
router.post("/", authenticateUser, adminPlusOwnerCheck, async (req, res) => {
  try {
    const playarea = await PlayareasModel.create({
      ...req.body,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: playarea,
    });
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

    res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
    });
  }
});

// Get All Playareas
router.get("/", async (req, res) => {
  try {
    var match = {};

    if (req.query?.owner) {
      match.owner = new ObjectId(req.query?.owner);
    }

    if (req.query?.keyword) {
      match.title = new RegExp(req.query.keyword,'i');
    }

    if (req.query?.isApproved) {
      match.isApproved = true
    }

    if (req.query.type) {
      match.type = req.query.type;
    }

    var playareas = await PlayareasModel.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
    ]);
    res.status(201).json({
      success: true,
      message: playareas,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
    });
  }
});

// Get Single Playareas
router.get("/:id", async (req, res) => {
  try {

    var playarea = await PlayareasModel.findById(req.params.id).populate("reviews.commentingUser").populate("owner")
    
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    async function getNextDatesWithDayNames(dayNames) {
      const nextDates = [];
      let daysAdded = 0;

      while (true) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + daysAdded);

        if(currentDate.getFullYear() > new Date().getFullYear()){
          break
        }

        const dayName = currentDate.toLocaleString("en-US", {
          weekday: "long",
        });

        if (dayNames.includes(dayName)) {
          var booked = await BookingsModel.findOne({
            playarea: req.params.id,
            status:"confirmed",
            bookingDate: {
              $gte: startOfDay(new Date(currentDate)),
              $lt: endOfDay(new Date(currentDate)),
            },
          });

          nextDates.push({
            day: dayName.substring(0, 3),
            date: currentDate.getDate(),
            month: months[currentDate.getMonth()],
            year: currentDate.getFullYear(),
            isBooked: booked ? true : false,
            jsDate: currentDate,
          });
        }

        daysAdded++;
      }

      return nextDates;
    }

    // Slotes
    const nextDates = await getNextDatesWithDayNames(
      playarea.openingHours.map((v, i) => v.day)
    );


    res.status(201).json({
      success: true,
      message: { ...playarea._doc, nextSlots: nextDates },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
    });
  }
});

// Delete Any Playarea for admin Only and their own for owner
router.delete(
  "/:id",
  authenticateUser,
  adminPlusOwnerCheck,
  async (req, res) => {
    try {
      var role = req.user.role;

      // Find Playarea by id
      var playarea = await PlayareasModel.findById(req.params.id);
      if (!playarea) {
        res.status(404).json({
          success: false,
          message: "Playarea Not Found!",
        });
        return;
      }

      if (role == "admin") {
        await PlayareasModel.findByIdAndDelete(req.params.id);
        res.json({
          success: true,
          message: "Playarea Deleted Successfully!",
        });
        return;
      } else {
        var playarea = await PlayareasModel.findOneAndDelete({
          _id: req.params.id,
          owner: req.user._id,
        });
        if (!playarea) {
          res.status(403).json({
            success: false,
            message: "You are not Authorized to Delete this Playarea!",
          });
          return;
        }
        res.json({
          success: true,
          message: "Playarea Deleted Successfully!",
        });
        return;
      }
    } catch (error) {
      if (error.kind === "ObjectId") {
        res.status(404).json({
          success: false,
          message: "Playarea Not Found!",
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Something Went Wrong!",
      });
    }
  }
);

// Update Any Playarea
router.put("/:id", authenticateUser, adminPlusOwnerCheck, async (req, res) => {
  try {
    var role = req.user.role;

    // Find Playarea by id
    var playarea = await PlayareasModel.findById(req.params.id);
    if (!playarea) {
      res.status(404).json({
        success: false,
        message: "Playarea Not Found!",
      });
      return;
    }

    if (role == "admin") {
      var updatedPlayarea = await PlayareasModel.findByIdAndUpdate(
        new ObjectId(req.params.id),
        { $set: { ...req.body, owner: req.body.owner._id } },
        { new: true }
      );
      res.json({
        success: true,
        message: updatedPlayarea,
      });
      return;
    } else {
      var updatedPlayarea = await PlayareasModel.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        { $set: { ...req.body, owner: req.body.owner._id } },
        { new: true }
      );
      if (!playarea) {
        res.status(403).json({
          success: false,
          message: "You are not Authorized to Upate this Playarea!",
        });
        return;
      }
      res.json({
        success: true,
        message: updatedPlayarea,
      });
      return;
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(404).json({
        success: false,
        message: "Playarea Not Found!",
      });
      return;
    }

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

    res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
    });
  }
});

// Change Approve Status of Any Playarea
router.get(
  "/change-approve-stutus/:id",
  authenticateUser,
  adminPlusOwnerCheck,
  async (req, res) => {
    try {
      // Find Playarea by id
      var playarea = await PlayareasModel.findById(req.params.id);
      if (!playarea) {
        res.status(404).json({
          success: false,
          message: "Playarea Not Found!",
        });
        return;
      }

      if (!playarea.isApproved) {
        await PlayareasModel.findByIdAndUpdate(
          req.params.id,
          { $set: { isApproved: true } },
          { new: true }
        );
        res.json({
          success: true,
          message: "Playarea Approved Successfully!",
        });
        return;
      } else {
        await PlayareasModel.findByIdAndUpdate(
          req.params.id,
          { $set: { isApproved: false } },
          { new: true }
        );
        res.json({
          success: true,
          message: "Playarea again set to Not Approved Successfully!",
        });
        return;
      }
    } catch (error) {
      if (error.kind === "ObjectId") {
        res.status(404).json({
          success: false,
          message: "Playarea Not Found!",
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Something Went Wrong!",
      });
    }
  }
);

router.post("/review/:id", authenticateUser, async (req, res) => {
  try {
    // Find Playarea by id
    var playarea = await PlayareasModel.findById(req.params.id);
    if (!playarea) {
      res.status(404).json({
        success: false,
        message: "Playarea Not Found!",
      });
      return;
    }

    let updatedPlayarea = await PlayareasModel.findByIdAndUpdate(
      new ObjectId(req.params.id),
      { $push: { reviews: { commentingUser: req.user._id, ...req.body } } },
      { new: true }
    );

    res.json({
      success: true,
      message: updatedPlayarea,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/review/:id", authenticateUser, async (req, res) => {
  try {
    // Find Playarea by id
    var playarea = await PlayareasModel.findById(req.params.id);
    if (!playarea) {
      res.status(404).json({
        success: false,
        message: "Playarea Not Found!",
      });
      return;
    }

    let updatedPlayarea = await PlayareasModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { reviews: {_id:req.body.id} } },
      { new: true }
    );

    res.json({
      success: true,
      message: updatedPlayarea,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
