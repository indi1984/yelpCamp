const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Mongo Atlas database connected.');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20 + 10);
    const camp = new Campground({
      author: '63bb6ce7b23ba02b67976718',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis est nulla voluptatibus doloribus deserunt illum accusamus non eum natus. Quas ipsam quod pariatur voluptas doloremque eos. Quam aliquid neque esse?',
      price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {

          url: 'https://res.cloudinary.com/dthjvj2og/image/upload/v1673309221/YelpCamp/yhp8rjbczp4u2bvzd8y7.jpg',
          filename: 'YelpCamp/yhp8rjbczp4u2bvzd8y7',
        },
        {

          url: 'https://res.cloudinary.com/dthjvj2og/image/upload/v1673309221/YelpCamp/h2jsl5dcrvotrczusujh.jpg',
          filename: 'YelpCamp/h2jsl5dcrvotrczusujh',
        },
        {
          url: 'https://res.cloudinary.com/dthjvj2og/image/upload/v1673309221/YelpCamp/gmpq5te2tbjn7ivfbyzl.jpg',
          filename: 'YelpCamp/gmpq5te2tbjn7ivfbyzl',
        },
        {
          url: 'https://res.cloudinary.com/dthjvj2og/image/upload/v1673309222/YelpCamp/ytmgca5eufxp2iwklhwy.jpg',
          filename: 'YelpCamp/ytmgca5eufxp2iwklhwy',
        },
        {
          url: 'https://res.cloudinary.com/dthjvj2og/image/upload/v1673309222/YelpCamp/we1crc0xhm8ge5knr4vl.jpg',
          filename: 'YelpCamp/we1crc0xhm8ge5knr4vl',
        },
        {
          url: 'https://res.cloudinary.com/dthjvj2og/image/upload/v1673309222/YelpCamp/nss3ehubvlz8apno1dcj.jpg',
          filename: 'YelpCamp/nss3ehubvlz8apno1dcj',
        },
        {
          url: 'https://res.cloudinary.com/dthjvj2og/image/upload/v1673309222/YelpCamp/lj8u4wclkrhyaz4edocq.jpg',
          filename: 'YelpCamp/lj8u4wclkrhyaz4edocq',
        },
        {
          url: 'https://res.cloudinary.com/dthjvj2og/image/upload/v1673309223/YelpCamp/gq5lccuekzq6m7zonfrc.jpg',
          filename: 'YelpCamp/gq5lccuekzq6m7zonfrc',
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  console.log('Seed complete! Closing connection.');
  mongoose.connection.close();
});
