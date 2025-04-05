const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL = 'mongodb://127.0.0.1:27017/mydbpro1'; // MongoDB connection URL
main()
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});
// The main function connects to the MongoDB database using the MONGO_URL.
async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({}); // Delete all existing listings in the database
    await Listing.insertMany(initData.data); // Insert initial data into the database
    console.log('Database initialized with sample data');
}

initDB()