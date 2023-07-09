import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    walletamount: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: {
        _id: false,
        isAdd:Boolean,
        date: String,
        time: String,
      },
      required: true,
    },

  },
  { _id: false } // Exclude _id field from the subdocument
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    // address: {
    //   type: {},
    //   required: true,
    // },
    // answer: {
    //   type: String,
    //   required: true,
    // },
    role: {
      type: Number,
      default: 0,
    },
    walletamount: {
      type: Number,
      default: 0,
    },
    walletHistory: [walletSchema],
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
