const UserCLTN = require("../../models/user/details");
const CartCLTN = require("../../models/user/cart");
const WishlistCLTN = require("../../models/user/wishlist");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const nodemailer = require("nodemailer");
const { default: mongoose } = require("mongoose");

exports.signUpPage = (req, res) => {
  try {
    if (req.session.tempOTP != false) {
      req.session.tempOTP = false;
      // console.log("Account creation OTP: " + req.session.tempOTP);
    }
    res.render("user/partials/signUp", {
      documentTitle: "User Sign Up | TIMELESS",
    });
  } catch (error) {
    console.log("Error rendering user signup page: " + error);
  }
};

// Register User
exports.registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUserDetails = {
      name: req.body.name.trim(),
      number: req.body.number,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
    };
    req.session.newUserDetails = newUserDetails;
    const inputEmail = req.body.email;
    const inputNumber = req.body.number;
    const emailCheck = await UserCLTN.findOne({ email: inputEmail });
    const numberCheck = await UserCLTN.findOne({ number: inputNumber });
    if (emailCheck || numberCheck) {
      res.render("user/partials/signUp", {
        documentTitle: "User Sign Up | TIMELESS",
        errorMessage: "User already existing",
      });
    } else {
      const tempOTP = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
      req.session.tempOTP = tempOTP;

      // Transporter
      const transporter = await nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.TRANSPORTER_USERNAME,
          pass: process.env.TRANSPORTER_PASSWORD,
        },
      });

      // Mail options
      const mailOptions = await {
        from: process.env.TRANSPORTER_USERNAME,
        to: inputEmail,
        subject: "OTP Verification | TIMELESS eCommerce",
        html: `<h1>OTP</h1></br><h2 style="text-color: red, font-weight: bold">${tempOTP}</h2></br><p>Enter the OTP to create account.</p>`,
      };

      // Send mail
      await transporter.sendMail(mailOptions);
      console.log("Account creation OTP Sent: " + req.session.tempOTP);
      res.redirect("/users/otp_verification");
    }
  } catch (error) {
    console.log("Error signing up user: " + error);
  }
};

exports.otpPage = (req, res) => {
  try {
    res.render("user/partials/otp", {
      documentTitle: "OTP Verification | TIMELESS",
    });
  } catch (error) {
    console.log("Error rendering OTP Page: " + error);
  }
};

exports.otpVerification = async (req, res) => {
  try {
    if (req.session.tempOTP) {
      if (req.session.tempOTP == req.body.otp) {
        console.log("Account creation OTP deleted: " + req.session.tempOTP);
        const newUserDetails = new UserCLTN(req.session.newUserDetails);
        newUserDetails.save();
        req.session.tempOTP = false;
        res.redirect("/users/signIn");
        const userID = newUserDetails._id;
        const newCart = await new CartCLTN({
          customer: mongoose.Types.ObjectId(userID),
        });
        await UserCLTN.findByIdAndUpdate(userID, {
          $set: { cart: mongoose.Types.ObjectId(newCart._id) },
        });
        await newCart.save();
        const newWishlist = await new WishlistCLTN({
          customer: mongoose.Types.ObjectId(userID),
        });
        await UserCLTN.findByIdAndUpdate(userID, {
          $set: { wishlist: mongoose.Types.ObjectId(newWishlist._id) },
        });
        await newWishlist.save();
      } else {
        res.render("user/partials/otp", {
          documentTitle: "OTP Verification | TIMELESS",
          errorMessage: "Invalid OTP",
        });
      }
    } else {
      res.redirect("/users/signUp");
    }
  } catch (error) {
    console.log("Error verifying OTP: " + error);
  }
};
