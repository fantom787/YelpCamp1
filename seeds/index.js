const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../models/Campground");
const { places, decriptors, descriptors } = require("./seedHelpers");
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Db connection Sucessfull!!");
  })
  .catch((e) => {
    console.log("Error connecting DB", e);
  });

const samples = (a) => {
  return a[Math.floor(Math.random() * a.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 50) + 10;
    const c = new Campground({
      author: "64d38925cbf94024827c24bd",
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${samples(places)},${samples(descriptors)}`,
      image: "https://source.unsplash.com/collection/483251",
      price,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis necessitatibus possimus laudantium quia iste, non repellat, illo assumenda eos aperiam, dignissimos illum. Aliquid quis, omnis impedit voluptates quam blanditiis natus.",
    });
    await c.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
