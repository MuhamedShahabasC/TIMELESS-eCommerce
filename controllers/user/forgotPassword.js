const UserCLTN = require("../../models/user/details");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer')

const Page = (req, res) => {
  res.render("user/partials/forgotPassword", {
    documentTitle: "Forgot Password | User",
  });
};

const emailVerification = async (req, res) => {
  const inputEmail = req.body.email;
  const mailChecker = await UserCLTN.findOne({ email: inputEmail });
  if (mailChecker) {
    const tempOTP = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    req.session.resetPasswordAuth = inputEmail;
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
      subject: "Password Reset OTP | TIMELESS eCommerce",
      html: `<h1>OTP</h1></br><h2 style="text-color: red, font-weight: bold">${tempOTP}</h2></br><p>Enter the OTP to create account.</p>`,
    };

    // Send mail
    await transporter.sendMail(mailOptions);
    req.session.resetOTP = tempOTP;
    console.log("User Reset OTP Sent: " + req.session.resetOTP);
    res.redirect("/users/forgotPassword/otpVerification");
  } else {
    res.render("user/partials/forgotPassword", {
      documentTitle: "Forgot Password | User | TIMELESS",
      errorMessage: "User not found",
    });
  }
};

const otpPage = (req, res) => {
  if (req.session.resetPasswordAuth && req.session.resetOTP) {
    res.render("user/partials/otp", {
      documentTitle: "Update User Password | TIMELESS",
    });
  } else {
    res.redirect("/users/signIn");
  }
};

const otpVerification = (req, res) => {
  if (req.session.resetPasswordAuth && req.session.resetOTP) {
    const inputOTP = req.body.otp;
    const resetOTP = req.session.resetOTP;
    if (inputOTP == resetOTP) {
      req.session.resetOTP = false;
      req.session.updatePassword = true;
      console.log("Session created for user password change");
      res.redirect("/users/changePassword");
    } else {
      res.render("user/partials/otp", {
        documentTitle: "Update User Password | TIMELESS",
        errorMessage: "Invalid OTP",
      });
    }
  } else {
    res.redirect("/users/signIn");
  }
};

const passwordChangePage = (req, res) => {
  if (req.session.updatePassword && req.session.resetPasswordAuth) {
    res.render("user/partials/changePassword", {
      documentTitle: "User Password Reset | TIMELESS",
    });
  } else {
    res.redirect("/users/forgotPassword");
  }
};

const updatePassword = async (req, res) => {
  if (req.session.resetPasswordAuth && req.session.updatePassword) {
    const customerEmail = req.session.resetPasswordAuth;
    const newPassword = req.body.newPassword;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserCLTN.updateOne(
      { email: customerEmail },
      { $set: { password: hashedPassword } }
    );
    req.session.updatePassword = false;
    req.session.resetPasswordAuth = false;
    console.log("User password updated.");
    res.redirect("/users/signIn");
  } else {
    res.redirect("/users/signIn");
  }
};

module.exports = {
  Page,
  emailVerification,
  passwordChangePage,
  otpPage,
  otpVerification,
  updatePassword,
};
