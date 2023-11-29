const Campground = require("../models/Campground");
const { cloudinary } = require("../cloudinary/index");
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campground/index", { campgrounds });
};
module.exports.renderNewForm = (req, res) => {
  res.render("campground/new");
};
module.exports.createCampground = async (req, res, next) => {
  const imageData = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  console.log("here in createCampground");
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  campground.images = imageData;
  await campground.save();
  req.flash("success", "Successfully made a new campground! ");
  res.redirect(`/campground/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
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
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campground");
  }
  res.render("campground/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const imageData = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  const { id } = req.params;
  const camp = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  camp.images.push(...imageData);
  await camp.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully made a new campground! ");
  res.redirect(`/campground/${camp._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted !  ");
  res.redirect("/campground");
};
