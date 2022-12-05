const express = require("express");
const {
  createProduct,
  updateProduct,
  getProduct,
  getSingleProduct,
  deleteProduct,
} = require("../controllers/productController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();
const { uploads } = require("../utils/fileUploads");

router.post("/", protect, uploads.single("image"), createProduct);
router.patch("/:id", protect, uploads.single("image"), updateProduct);
router.get("/", protect, getProduct);
router.get("/:id", protect, getSingleProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
