const express = require("express");
const { isLoggedin, validateCampground, isAuthor } = require("../middleware");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/Campground");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });
router.get("/", catchAsync(campgrounds.index));

router.get("/new", isLoggedin, campgrounds.renderNewForm);

router.post(
  "/",
  isLoggedin,
  upload.array("image"),
  validateCampground,
  catchAsync(campgrounds.createCampground)
);

// router.post("/",upload.array("image"), (req, res) => {
//   console.log(req.files,req.body);
//   res.send(req.body);
// });

router.get("/:id", catchAsync(campgrounds.showCampground));

router.get(
  "/:id/edit",
  isLoggedin,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

router.put(
  "/:id",
  isLoggedin,
  isAuthor,
  upload.array("image"),
  validateCampground,
  catchAsync(campgrounds.updateCampground)
);

router.delete(
  "/:id",
  isLoggedin,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
