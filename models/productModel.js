 import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    funded: {
      type: Number,
      required: true,
    },
    backers: {
      type: Number,
      required: true,
    },
    totalFund: {
      type: Number,
      required: true,
    },
    fundRaised:{
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    assetvalue: {
      type: Number,
      required: true,
    },
    minInvestment: {
      type: Number,
      required: true,
    },
    rentalYield: {
      type: Number,
      required: true,
    },
    targetIRR: {
      type: Number,
      required: true,
    },
    targetMultiple: {
      type: Number,
      required: true,
    },
    locationName: {
      type: String,
      required: true,
    },
    locationDesc: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    tenancy: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);
