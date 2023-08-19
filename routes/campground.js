const express = require("express");
const { isLoggedin, validateCampground, isAuthor } = require("../middleware");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/Campground");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campground/index", { campgrounds });
  })
);

router.get("/new", isLoggedin, (req, res) => {
  res.render("campground/new");
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campground");
    }
    res.render("campground/show", {
      campground,
    });
  })
);

router.post(
  "/",
  isLoggedin,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new campground! ");
    res.redirect(`/campground/${campground._id}`);
  })
);

router.get(
  "/:id/edit",
  isLoggedin,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Cannot find that campground");
      return res.redirect("/campground");
    }
    res.render("campground/edit", { campground });
  })
);

router.put(
  "/:id",
  isLoggedin,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully made a new campground! ");
    res.redirect(`/campground/${camp._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedin,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted !  ");
    res.redirect("/campground");
  })
);

module.exports = router;
