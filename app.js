const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const { name } = require("ejs");
const ejsMate = require("ejs-mate"); // EJS Mate is a template engine that extends EJS with additional features
const wrapAsync = require("./utils/wrapAsync.js"); // Wrap async functions to handle errors
const ExpressError = require("./utils/ExpressError.js"); // Custom error handling class

const MONGO_URL = "mongodb://127.0.0.1:27017/mydbpro1";
main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// The main function connects to the MongoDB database using the MONGO_URL.
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs"); // Set EJS as the templating engine
app.set("views", path.join(__dirname, "views")); // Set the views directory to the 'views' folder in the current directory
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data
app.use(methodOverride("_method")); //The methodOverride middleware allows you to use HTTP verbs like PUT, DELETE, and PATCH in HTML forms, which normally only support GET and POST.
app.engine("ejs", ejsMate); // Use ejs locals for all ejs templates
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the 'public' directory

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Index route for listings
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//new route for listings
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route for listings
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

//create route for listings
app.post(
  "/listings", //Sets up a route handler for POST requests to the "/listings" endpoint
  wrapAsync(async (req, res, next) => {
    if (!req.body.listing){
        throw new ExpressError(400, "Invalid Listing Data"); // Check if the listing data is valid
    }
    const newListing = new Listing(req.body.listing); // Create a new listing using the data from the form
    await newListing.save(); // Save the new listing to the database
    res.redirect("/listings"); // Redirect to the index page after saving
  })
);

//edit route for listings
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params; // Get the ID from the request parameters
    const listing = await Listing.findById(id); // Find the listing by ID in the database
    res.render("listings/edit.ejs", { listing });
  })
);

//update route for listings
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    if (!req.body.listing){
        throw new ExpressError(400, "Invalid Listing Data"); // Check if the listing data is valid
    }
    let { id } = req.params; // Get the ID from the request parameters
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // Update the listing in the database
    res.redirect(`/listings/${id}`); // Redirect to the show page of the updated listing
  })
);

//delete route for listings
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params; // Get the ID from the request parameters
    let deletedListing = await Listing.findByIdAndDelete(id); // Delete the listing from the database
    res.redirect("/listings"); // Redirect to the index page after deletion
    console.log("Deleted this listing:", deletedListing.title); // Log the ID of the deleted listing
  })
);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!!"));
});

app.use((err, req, res, next) => {
  // Error handling middleware
  let { statusCode = 500, message = "Something went wrong" } = err; // Destructure the error object to get status code and message
  res.status(statusCode).render("error.ejs", {message}); // Render the error page
  //res.status(statusCode).send(message); // Send the error response to the client
});

app.listen(8080, () => {
  // Start the server on port 8080
  console.log("Server is running on port 8080");
});
