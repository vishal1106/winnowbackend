import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  console.log(req.body);
  try {
    const {
      name,
      email,
      password,
      phone,
      // address,
      //  answer
    } = req.body;
    //validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    // if (!address) {
    //   return res.send({ message: "Address is Required" });
    // }
    // if (!answer) {
    //   return res.send({ message: "Answer is Required" });
    // }
    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      // address,
      password: hashedPassword,
      // answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registeration",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    console.log(message)
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log(token);
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
//update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};
//forgotPasswordController

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Emai is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

export const updateAdminProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone, role } = req.body;
    console.log(req.body);
    const user = await userModel.find({ email });
    //password

    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findOneAndUpdate(
      { email: email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
        role: role || user.role,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

export const updateWalletAccount = async (req, res) => {
  try {
    const { email, walletamount, reason } = req.body;

    const user = await userModel.find({ email });

    if (user) {
      let newwalletamount = user[0].walletamount + Number(walletamount);

      const currentDate = new Date();
      const timestamp = {
        isAdd: true,
        date: currentDate.toLocaleDateString(),
        time: currentDate.toLocaleTimeString(),
      };

      const newWalletObject = {
        reason,
        walletamount: Number(walletamount),
        timestamp,
      };

      let updatedUser = await userModel.findOneAndUpdate(
        { email },

        {
          $set: { walletamount: newwalletamount },
          $push: { walletHistory: newWalletObject },
        },
        { new: true }
      );

      res.status(200).send({
        success: true,
        message: "Amount added successfully",
        data: updatedUser,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while updating wallet",
      error,
    });
  }
};

// Deduct the money from wallet
// export const updateWalletDeduct = async (req, res) => {
//   try {
//     const { email, walletamount } = req.body;
//     const user = await userModel.find({ email });
//     //password

//     if (user && walletamount <=user.walletamount) {
//       let newwalletamount = user[0].walletamount - Number(walletamount);
//       let data = await userModel.findOneAndUpdate(
//         { email: email },
//         { walletamount: newwalletamount },
//         { new: true }
//       );

//       res.status(200).send({
//         success: true,
//         message: "amount is added Successfully",
//         data,
//       });
//     } else {
//       res.status(404).send({
//         success: false,
//         message: "User not found",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(400).send({
//       success: false,
//       message: "Error WHile Update Wallet",
//       error,
//     });
//   }
// };
export const updateWalletDeduct = async (req, res) => {
  try {
    const { email, walletamount, reason } = req.body;

    const user = await userModel.find({ email });

    if (user && walletamount <= user[0].walletamount) {
      let newwalletamount = user[0].walletamount - Number(walletamount);
      console.log(newwalletamount);
      const currentDate = new Date();
      const timestamp = {
        isAdd: false,
        date: currentDate.toLocaleDateString(),
        time: currentDate.toLocaleTimeString(),
      };

      const newWalletObject = {
        reason,
        walletamount: Number(walletamount),
        timestamp,
      };

      let updatedUser = await userModel.findOneAndUpdate(
        { email },

        {
          $set: { walletamount: newwalletamount },
          $push: { walletHistory: newWalletObject },
        },
        { new: true }
      );

      res.status(200).send({
        success: true,
        message: "Amount added successfully",
        data: updatedUser,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while updating wallet",
      error,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//access all orders
export const getallusers = async (req, res) => {
  try {
    const data = await userModel.find();
    res.status(200).send(data);
  } catch (error) {
    res.status(401).send(error);
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

export const DeleteUsers = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const data = await userModel.findByIdAndDelete({ _id: id });
    res.status(200).send({
      success: true,
      massage: "User Deleted Successfully",
      data,
    });
  } catch (error) {
    res.send(500).send({
      success: false,
      massage: "Error while Delete the user",
    });
  }
};
