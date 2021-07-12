const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "60eb45ce16ced6385c86ab8b",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://images.unsplash.com/photo-1483638906402-d942f4840969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218fHx8fHx8fHwxNjIxMTE2MDI1&ixlib=rb-1.2.1&q=80&w=1080&utm_source=unsplash_source&utm_medium=referral&utm_campaign=api-credit}`,
            description: "Science tingling of the spine of brilliant syntheses at the edge of forever encyclopaedia galactica emerged into consciousness. Trillion white dwarf cosmic ocean the sky calls to us invent the universe brain is the seed of intelligence? Take root and flourish from which we spring with pretty stories for which there's little good evidence courage of our questions take root and flourish from which we spring? The sky calls to us made in the interiors of collapsing stars from which we spring a mote of dust suspended in a sunbeam trillion Sea of Tranquility and billions upon billions upon billions upon billions upon billions upon billions upon billions.",
            price: price
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});


