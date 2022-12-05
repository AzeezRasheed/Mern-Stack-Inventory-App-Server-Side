const asyncHandler = require("express-async-handler");
const Product = require("../model/productModel");
const { fileSizeFormatter } = require("../utils/fileUploads");
const cloudinary = require("cloudinary").v2;

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, price, quantity } = req.body;

  if (!name || !description || !category || !price || !quantity) {
    res.status(400);
    throw new Error("Please fill in the required fields");
  }

  let fileData = {};
  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Mern Project New",
        resource_type: "image",
      });
    } catch (e) {
      res.status(500);
      throw new Error("Could not upload file");
    }
    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  const product = await Product.create({
    user: req.user._id,
    name,
    description,
    category,
    price,
    quantity,
    image: fileData,
  });

  if (product) {
    res.status(201);
    res.json(product);
  } else {
    res.status(400);
    throw new Error("Could not create product");
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, category, price, quantity } = req.body;

  const product = await Product.findById(id);

  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  if (product) {
    let fileData = {};

    if (req.file) {
      let uploadedFile;
      try {
        uploadedFile = await cloudinary.uploader.upload(req.file.path, {
          folder: "Mern Project New",
          resource_type: "image",
        });
      } catch (e) {
        res.status(500);
        throw new Error("Could not upload file");
      }
      fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: id },
      {
        name,
        description,
        category,
        price,
        quantity,
        image: Object.keys(fileData).length === 0 ? product?.image : fileData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedProduct);
  }
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.find({ user: req.user._id });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200);
  res.json(product);
});

const getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  res.status(200).json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await Product.findOneAndDelete({ _id: id });
  res.status(200).json("Successful Deleted Product");
});
module.exports = {
  createProduct,
  updateProduct,
  getProduct,
  getSingleProduct,
  deleteProduct,
};
