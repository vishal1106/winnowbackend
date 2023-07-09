import express from "express";
import {
  brainTreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  realtedProductController,
  searchProductController,
  updateProductController,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();
import multer from "multer"
// const multer = require("multer");
import createProductModels from "../models/CreateProductSchema.js"
import moment from "moment"

// multer code start
// img storage path
const imgconfig = multer.diskStorage({
  destination:(req,file,callback)=>{
      callback(null,"./uploads")
  },
  filename:(req,file,callback)=>{
      callback(null,`imgae-${Date.now()}. ${file.originalname}`)
  }
})


// img filter
const isImage = (req,file,callback)=>{
  if(file.mimetype.startsWith("image")){
      callback(null,true)
  }else{
      callback(new Error("only images is allowd"))
  }
}

const upload = multer({
  storage:imgconfig,
  fileFilter:isImage
});

// / user register
router.post("/register",upload.single("photo"),async(req,res)=>{

    const {filename} = req.file;

    const {fname,funded,backers,totalFund,fundRaised,categories} = req.body;

    

    if(!fname || !filename || !funded || !backers || !totalFund || !fundRaised || !categories ){
        res.status(401).json({status:401,message:"fill all the data"})
    }

    try {

        const date = moment(new Date()).format("YYYY-MM-DD");
        console.log(fname,funded,backers,totalFund,fundRaised,categories)
        const userdata = new createProductModels({
            fname:fname,
            imgpath:filename,
            date:date,
            backers,
            funded,
            totalFund,
            fundRaised,
            categories
        });

        const finaldata = await userdata.save();

        res.status(201).json({status:201,finaldata});

    } catch (error) {
        res.status(401).json({status:401,error})
    }
});


// multer code End

//routes
router.post(
  "/create-product",
  // requireSignIn,
  // isAdmin,
  // formidable(),
  createProductController
);
//routes
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get products
router.get("/get-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete rproduct
router.delete("/delete-product/:pid", deleteProductController);

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router;
