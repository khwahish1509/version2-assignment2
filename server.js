/****************************************************************************
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Assignment: 1
* Student Name: Khwahish vaid
* Student Email: kvaid1@myseneca.ca
* Course/Section: WEB422/ZAA
* Deployment URL: 
*****************************************************************************/

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
// Test Route
app.get('/', (req, res) => {
  res.json({ message: "API Listening" });
});


// Adding pre-built modules
const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();

////////////////////////////////////////////////////////////////////////

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Server listening on: ${HTTP_PORT}`);
  });
}).catch((err) => {
  console.error(err);
});

// API's

// POST route to add a new listing
app.post('/api/listings', async (req, res) => {
    try {
      const newListing = await db.addNewListing(req.body);
      res.status(201).json(newListing);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to add new listing' });
    }
  });
  

  app.get("/api/listings", (req, res) => {
    if((!req.query.page || !req.query.perPage)) res.status(500).json({message: "Missing query parameters"})
    else {
        db.getAllListings(req.query.page, req.query.perPage, req.query.name)
        .then((data) => {
            if(data.length === 0) res.status(204).json({message: "No data returned"});
            else res.status(201).json(data);
        })
        .catch((err) => { res.status(500).json({error: err}) })
    }
});

  app.get('/api/listings/:id', (req, res) => {
    db.getListingById(req.params.id).then((listing) => {
      res.json(listing);
    }).catch((err) => {
      res.status(500).json({ message: "Error fetching listing" });
    });
  });

  app.put('/api/listings/:id', (req, res) => {
    db.updateListingById(req.body, req.params.id).then(() => {
      res.status(200).json({ message: "Listing updated successfully" });
    }).catch((err) => {
      res.status(500).json({ message: "Error updating listing" });
    });
  });

  app.delete('/api/listings/:id', (req, res) => {
    db.deleteListingById(req.params.id).then(() => {
      res.status(204).end();
    }).catch((err) => {
      res.status(500).json({ message: "Error deleting listing" });
    });
  });
  
  module.exports=app;
