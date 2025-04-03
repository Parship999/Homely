const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('../models/listing.js');

const MONGO_URL = 'mongodb://127.0.0.1:27017/mydbpro1';
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

app.get('/', (req, res) => {
    res.send('Hello World!');
});
/* app.get('/') sets up a route handler for HTTP GET requests to the root URL.
When a user accesses the root URL, the callback function (req, res) => {...} executes.
res.send('Hello World!') sends the text "Hello World!" as the response. */

app.get('/testListing', async (req, res) => {
    let sampleListing = new Listing({
        title: "My New Home",
        description: "By the beach",
        image: "",
        price: 1200,
        location: "New York",
        country: "USA"
    });

    await sampleListing.save();
    console.log('Sample listing saved');
    res.send('successful testing');
})

app.listen(8080, () => { // Start the server on port 8080
  console.log('Server is running on port 8080');
});