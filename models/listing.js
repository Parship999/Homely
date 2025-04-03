const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        filename: String,
        url: String
    },
    price:Number,
    location: {
        type: String,
    },
    country: {
        type: String,
    }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
/* mongoose.model('Listing', listingSchema):
-Creates a Mongoose model named 'Listing' using the provided listingSchema
-This model will be used to interact with a MongoDB collection named "listings" (Mongoose automatically pluralizes the model name)
-The model provides methods like find(), create(), update(), etc. to interact with the database

-module.exports = Listing:
-Exports the Listing model so it can be imported and used in other files
-Other files can import it using const Listing = require('./path-to-this-file')*/