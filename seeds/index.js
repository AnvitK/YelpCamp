const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    // useNewUrlParser: true,
    // useCreateIndex: true,     in mongo 6 all these are by default true
    // useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '637299c353a1e12ebd48fab7',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sunt, accusamus perspiciatis ducimus architecto deleniti quasi corrupti impedit eos nostrum deserunt nemo consequuntur quia error soluta dolores corporis, explicabo, eligendi assumenda?',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dzd8ejkma/image/upload/v1668686939/YelpCamp/v6babevt23brycav9rzr.jpg',
                    filename: 'YelpCamp/v6babevt23brycav9rzr'
                },
                {
                    url: 'https://res.cloudinary.com/dzd8ejkma/image/upload/v1668686942/YelpCamp/lr8ytqkkgwjwcbgkq26q.jpg',
                    filename: 'YelpCamp/lr8ytqkkgwjwcbgkq26q'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})