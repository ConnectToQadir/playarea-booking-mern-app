const router = require("express").Router();
const UsersModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("email-validator");
const authenticateUser = require("../middlewares/authenticateUser");

router.post("/register", async (req, res) => {
  try {
    if (!req.body.email) {
      res.status(400).json({
        success: false,
        message: "Email is Required!",
      });
      return;
    } else if (!validator.validate(req.body.email)) {
      res.status(400).json({
        success: false,
        message: "Please enter a valid Email!",
      });
      return;
    }

    if (!req.body.password) {
      res.status(400).json({
        success: false,
        message: "Password is Requied!",
      });
      return;
    }

    var hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await UsersModel.create({
      ...req.body,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: user,
    });
  } catch (error) {
    console.log(error);
    // Duplication Error Handling
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        res.status(409).json({
          success: false,
          message: "Email Already in Use!",
        });
      }
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

router.post("/login", async (req, res) => {
  try {
    if (!(req.body.email && req.body.password)) {
      res.status(400).json({
        success: false,
        message: "Email and Password are Required!",
      });
      return;
    }

    const foundUser = await UsersModel.findOne({ email: req.body.email });
    if (!foundUser) {
      res.status(404).json({
        success: false,
        message: "Invalid Email or Password!",
      });
      return;
    }

    var isPasswordValid = await bcrypt.compare(
      req.body.password,
      foundUser.password
    );
    if (!isPasswordValid) {
      res.status(404).json({
        success: false,
        message: "Invalid Email or Password!",
      });
      return;
    }

    var token = jwt.sign({ id: foundUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("accessToken", token, { httpOnly: true });

    res.json({
      success: true,
      message: "Login Successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
    });
  }
});

router.get("/profile", authenticateUser, async (req, res) => {
  try {
    res.json({
      success: true,
      message: req.user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
    });
  }
});

router.get("/logout", authenticateUser, async (req, res) => {
  try {
    res.cookie("accessToken", "", { httpOnly: true });
    res.json({
      success: true,
      message: "Secure Logout Successful!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
    });
  }
});

router.post("/update-profile", authenticateUser, async (req, res) => {
  try {
    if (req.query.phone) {
      var d = await UsersModel.findByIdAndUpdate(req.user._id, {
        $set: { phone: req.query.phone },
      });

      res.json({
        success: true,
        message: "Phone Number Updated Successfully!",
      });
      return;
    }

    var d = await UsersModel.findByIdAndUpdate(req.user._id, {
      $set: { photo: req.body.url },
    });

    res.json({
      success: true,
      message: "Profile Updated Successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
    });
  }
});

module.exports = router;
