/********************************************************************************
 * WEB422 – Assignment 1
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Yoojin Lee     Student ID: 188162218      Date: Jan 18, 2024
 *
 * Published URL: https://pear-wandering-harp-seal.cyclic.app
 *
 ********************************************************************************/

// Importing required modules and setting up environment variables
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();


// Importing and initializing the ListingsDB class
const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();


// Setting up the HTTP port, JSON parsing middleware, and CORS middleware
const HTTP_PORT = process.env.PORT || 8080;
app.use(express.json()); // parse the JSON provided in the request bod
app.use(cors());


// Initializing the MongoDB connection and starting the server
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });


// Route for the root path, indicating API is listening
app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});


// CREATE
/*
This route uses the body of the request to add a new "Listing" document to the collection 
and return the newly created listing object / fail message to the client
{
  "_id": "1234",
  "amenities": [],
  "reviews": [],
  "__v": 0
}
*/
app.post("/api/listings", async (req, res) => {
  let newListing = await db.addNewListing(req.body);

  if (newListing) {
    res.status(201).send(newListing);
  } else {
    res.status(404).send({ message: "Failed to create listing" });
  }
});


// READ (ALL)
/*
  This route must accept the numeric query parameters "page" and "perPage" as well as the (optional) string parameter "name", 
  ie: /api/listings?page=1&perPage=5&name=Volcanoes National Park. 
  It will use these values to return all "Listings" objects for a specific "page" to the client as well as optionally filtering by "name", if provided 
  (in this case, it will show both listings containing the name “Volcanoes National Park”).
*/
app.get("/api/listings", async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);
    const name = req.query.name || null; // optional

    if (isNaN(page) || isNaN(perPage)) {
      return res
        .status(400)
        .send({ message: "Invalid page or perPage values." });
    }

    let listings = await db.getAllListings(page, perPage, name);

    res.status(200).send(listings);
  } catch (error) {
    res.status(404).send({ message: err });
  }
});


// READ (ONE)
app.get("/api/listings/:id", async (req, res) => {
  let listing = await db.getListingById(req.params.id);

  if (listing) {
    res.status(201).send(listing);
  } else {
    res
      .status(404)
      .send({ message: `No result found with id: ${req.params.id}` });
  }
});


// UPDATE
/*
  This route must accept a route parameter that represents the _id of the desired listing object, 
  ie: /api/listings/9696653 as well as read the contents of the request body. 
  It will use these values to update a specific "Listing" document in the collection and return a success / fail message to the client.
*/
app.put("/api/listings/:id", async (req, res) => {
  try {
    await db.updateListingById(req.body, req.params.id);
    res.status(201).send({ message: "Listing updated successfully" });
  } catch (err) {
    res.status(404).send({ message: err });
  }
});


// DELETE
app.delete("/api/listings/:id", async (req, res) => {
  try {
    await db.deleteListingById(req.params.id);
    res.status(201).send({ message: "Listing deleted successfully" });
  } catch (err) {
    res.status(404).send({ message: err });
  }
});
