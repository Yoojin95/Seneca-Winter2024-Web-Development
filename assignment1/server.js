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


// Set up HTTP port, JSON parsing middleware and CORS middleware
const HTTP_PORT = process.env.PORT || 8080;
app.use(express.json()); // parse the JSON provided in the request bod
app.use(cors());


// Set up MongoDB connection
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });


// Route for default url path
app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});


// CREATE
/*
app.post("/api/listings", async (req, res) => {
  let newListing = await db.addNewListing(req.body);

  if (newListing) {
    res.status(201).send(newListing);
  } else {
    res.status(404).send({ message: "Failed to create listing" });
  }
});
*/
app.post("/api/listings", (req, res) => {
  db.addNewListing(req.body)
     .then((message) => {
        res.status(201).json(message)
     })
     .catch((err) => {
        res.status(400).json({ message: err.message });
     });
});


// READ (ALL)
app.get("/api/listings", (req, res) => {
  db.getAllListings(req.query.page, req.query.perPage, req.query.name)
     .then((listings) => {
        res.status(200).json(listings)
     })
     .catch((err) => {
        res.status(400).json({ message: err.message});
     });
});


// READ (ONE)
app.get("/api/listings/:id", (req, res) => {
  db.getListingById(req.params.id)
     .then((listings) => {
      res.status(200).json(listings);
     })
     .catch((err) => {
        res.status(400).json({ message: err.message});
     });
});


// UPDATE
app.put("/api/listings/:id", (req, res) => {
  db.updateListingById(req.body, req.params.id)
     .then((message) => {
        res.status(200).json(message);
     })
     .catch((err) => {
      res.status(400).json({ message: err.message});
     });
});


// DELETE
app.delete("/api/listings/:id", (req, res) => {
  db.deleteListingById(req.params.id)
     .then((message) => {
        res.status(200).json(message);
     })
     .catch((err) => {
        res.status(400).json({ message: err.message });
     });
});
