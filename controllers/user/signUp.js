const UserCLTN = require("../../models/user/details");

const signUpPage = (req, res) => {
  if (req.session.tempOTP != false) {
    req.session.tempOTP = false;
    console.log("Account creation OTP: " + req.session.tempOTP);
  }
  res.render("user/partials/signUp", {
    documentTitle: "User Sign Up",
  });
};

// Register User
const bcrypt = require("bcrypt");
const saltRounds = 10;
const nodemailer = require("nodemailer");
let newUserDetails;
const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    newUserDetails = await new UserCLTN({
      name: req.body.name,
      number: req.body.number,
      email: req.body.email,
      password: hashedPassword,
    });
    const inputEmail = req.body.email;
    const inputNumber = req.body.number;
    const emailCheck = await UserCLTN.findOne({ email: inputEmail });
    const numberCheck = await UserCLTN.findOne({ email: inputNumber });
    if (emailCheck || numberCheck) {
      res.render("user/partials/signUp", {
        documentTitle: "User Sign Up",
        errorMessage: "User already existing",
      });
    } else {
      const tempOTP = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
      req.session.tempOTP = tempOTP;

      // OTP Session destroys in 5mins
      setTimeout(() => {
        req.session.tempOTP = false;
        console.log("Account creation OTP Expired.");
      }, 300000);

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
      res.redirect("/user/otp_verification");
    }
  } catch (error) {
    console.log("Signup error: " + error);
  }
};

const otpPage = (req, res) => {
  res.render("user/partials/otp", {
    documentTitle: "OTP Verification",
  });
};

const otpVerification = async (req, res) => {
  if (req.session.tempOTP == req.body.otp) {
    console.log("Account creation OTP deleted: " + req.session.tempOTP);
    newUserDetails.save();
    req.session.tempOTP = false;
    res.send("Account creation OTP deleted.");
  } else {
    res.render("user/partials/otp", {
      documentTitle: "OTP Verification",
      errorMessage: "Invalid OTP",
    });
  }
};

module.exports = {
  signUpPage,
  registerUser,
  otpPage,
  otpVerification,
};
