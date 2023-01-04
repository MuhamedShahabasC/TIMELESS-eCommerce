const { default: mongoose } = require("mongoose");
const cartCLTN = require("../../models/user/cart");
const userCLTN = require("../../models/user/details");
const couponCLTN = require("../../models/admin/coupons");
const orderCLTN = require("../../models/user/orders");

exports.view = async (req, res) => {
  try {
    const currentUser = await userCLTN.findById(req.session.userID);

    // Products in cart
    const userCart = await cartCLTN
      .findOne({
        customer: req.session.userID,
      })
      .populate("products.name");
    const products = userCart.products;
    if (userCart.totalQuantity != 0) {
      // All Address
      let allAddresses = await userCLTN.findById(req.session.userID);
      allAddresses = allAddresses.addresses;

      // Default Address
      let defaultAddress = await userCLTN.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(req.session.userID) },
        },
        {
          $unwind: "$addresses",
        },
        {
          $match: {
            "addresses.primary": true,
          },
        },
        {
          $project: {
            address: "$addresses",
          },
        },
      ]);
      if (defaultAddress != "") {
        defaultAddress = defaultAddress[0].address;
      } else {
        defaultAddress = 0;
      }

      // Rendering
      res.render("user/profile/partials/checkout", {
        defaultAddress,
        products,
        userCart,
        allAddresses,
        documentTitle: "Checkout | TIMELESS",
      });
    } else {
      res.redirect("/users/cart");
    }
  } catch (error) {
    console.log("Error rendering checkout page: " + error);
  }
};

exports.coupon = async (req, res) => {
  try {
    const couponCode = req.body.couponCode;
    const userCart = await cartCLTN.findOne({
      customer: req.session.userID,
    });
    const cartPrice = userCart.totalPrice;
    if (couponCode == "") {
      res.json({
        data: {
          couponCheck: null,
          discountPrice: 0,
          discountPercentage: 0,
          finalPrice: userCart.totalPrice,
        },
      });
    } else {
      const coupon = await couponCLTN.findOne({
        code: couponCode,
      });
      let discountPercentage = 0;
      let discountPrice = 0;
      let finalPrice = cartPrice;
      if (coupon) {
        discountPercentage = coupon.discount;
        discountPrice = (discountPercentage / 100) * cartPrice;
        finalPrice = cartPrice - discountPrice;
        couponCheck =
          '<b>Coupon Applied <i class="fa fa-check text-success" aria-hidden="true"></i></b></br>' +
          coupon.name;
      } else {
        couponCheck = "<b style='font-size:0.75rem'>Coupon not found</b>";
      }
      res.json({
        data: {
          couponCheck,
          discountPrice,
          discountPercentage,
          finalPrice,
        },
      });
    }
  } catch (error) {
    console.log("Error checking coupon: " + error);
  }
};

exports.defaultAddress = async (req, res) => {
  try {
    const userID = req.session.userID;
    const DefaultAddress = req.body.DefaultAddress;
    await userCLTN.updateMany(
      { _id: userID, "addresses.primary": true },
      { $set: { "addresses.$.primary": false } }
    );
    await userCLTN.updateOne(
      { _id: userID, "addresses._id": DefaultAddress },
      { $set: { "addresses.$.primary": true } }
    );
    res.redirect("/users/cart/checkout");
  } catch (error) {
    console.log("Error at checkout page changing default address: " + error);
  }
};

exports.checkout = async (req, res) => {
  try {
    // Shipping Address
    let shippingAddress = await userCLTN.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.session.userID),
        },
      },
      {
        $unwind: "$addresses",
      },
      {
        $match: {
          "addresses._id": mongoose.Types.ObjectId(req.body.addressID),
        },
      },
    ]);
    shippingAddress = shippingAddress[0].addresses;

    // Coupon used if any
    let couponUsed = await couponCLTN.findOne({
      code: req.body.couponCode,
    });
    if (couponUsed) {
      couponUsed = couponUsed._id;
    }
    if (!req.body.couponDiscount) {
      req.body.couponDiscount = 0;
    }

    // Cart summary
    const orderSummary = await cartCLTN.aggregate([
      {
        $match: {
          customer: mongoose.Types.ObjectId(req.session.userID),
        },
      },
      {
        $unwind: "$products",
      },
      {
        $project: {
          _id: 0,
          product: "$products.name",
          quantity: "$products.quantity",
          totalPrice: "$products.price",
        },
      },
    ]);
    const userCart = await cartCLTN.findOne({
      customer: req.session.userID,
    });

    // Creating order
    if (req.body.paymentMethod == "COD") {
      const orderDetails = new orderCLTN({
        customer: req.session.userID,
        shippingAddress: {
          building: shippingAddress.building,
          address: shippingAddress.address,
          pincode: shippingAddress.pincode,
          country: shippingAddress.country,
          contactNumber: shippingAddress.contactNumber,
        },
        modeOfPayment: req.body.paymentMethod,
        couponUsed: couponUsed,
        summary: orderSummary,
        totalQuantity: userCart.totalQuantity,
        price: userCart.totalPrice,
        finalPrice: req.body.finalPrice,
        discountPrice: req.body.couponDiscount,
      });
      await userCLTN.findByIdAndUpdate(req.session.userID, {
        $push: {
          orders: [mongoose.Types.ObjectId(req.params.id)],
          couponsUsed: [mongoose.Types.ObjectId(couponUsed)],
        },
      });
      await cartCLTN.findOneAndUpdate(
        {
          customer: req.session.userID,
        },
        {
          $set: { products: [], totalPrice: 0, totalQuantity: 0 },
        }
      );
      await orderDetails.save();
      res.redirect("/users/orders");
    }
  } catch (error) {
    console.log("Error checking out: " + error);
  }
};
