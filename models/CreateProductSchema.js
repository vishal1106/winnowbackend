import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    imgpath: {
        type: String,
        required: true
    },
    date: {
        type: Date
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
    fundRaised: {
        type: Number,
        required: true,
    },
    categories: {
        type: String,
        required: true
      },
    //   categories: {
    //     type: mongoose.ObjectId,
    //     ref: "categories",
    //     required: true,
    //   },
},
{ timestamps: true }
);


// create model

const createProductModels = new mongoose.model("productData", userSchema);

export default createProductModels

