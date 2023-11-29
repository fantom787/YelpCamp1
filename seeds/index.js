const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../models/Campground");
const { places, decriptors, descriptors } = require("./seedHelpers");
const dbUrl =
  "mongodb+srv://admin-ambuj:t123@cluster0.tjgxm8p.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(dbUrl, {
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
      author: "6566f6025d12d5a3e359e70a",
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${samples(places)},${samples(descriptors)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dfjqi0nke/image/upload/v1692681297/YelpCamp/pvnpawqz5m4ijsal9wka.jpg",
          filename: "YelpCamp/pvnpawqz5m4ijsal9wka",
        },
        {
          url: "https://res.cloudinary.com/dfjqi0nke/image/upload/v1692681297/YelpCamp/sk2p3dm3hwuw802mij17.jpg",
          filename: "YelpCamp/sk2p3dm3hwuw802mij17",
        },
        {
          url: "https://res.cloudinary.com/dfjqi0nke/image/upload/v1692681298/YelpCamp/aqgenifshvlaz2hdwwmu.jpg",
          filename: "YelpCamp/aqgenifshvlaz2hdwwmu",
        },
        {
          url: "https://res.cloudinary.com/dfjqi0nke/image/upload/v1692681298/YelpCamp/t2d85gm1zixeviupi4na.jpg",
          filename: "YelpCamp/t2d85gm1zixeviupi4na",
        },
      ],
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
