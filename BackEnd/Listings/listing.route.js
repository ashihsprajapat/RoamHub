

import express from 'express';
const Router = express.Router();
import upload from '../config/multer.js';
import { createListing, deleteListing, getAllListingHostByUser, deleteImageLiting, getAllListings, getListingById,  updateListing } from './listing.controller.js';
import { protectListing ,verifyEmail} from '../middleware/protectListing.js';



Router.route("/")  // caching
    .get(getAllListings)  // get all listing

    .post(                  // create Listing 
        protectListing,
        verifyEmail,
        upload.array("image",8),
        createListing
    );

//get all listing host by user
Router.route("/all-listing")
.get(protectListing,
    verifyEmail,
    getAllListingHostByUser   // caching 
)
    

Router.route("/:id")   // caching 
    .get(getListingById)  // get listing by id 

    .put(protectListing,
        verifyEmail, 
        upload.array("image", 4),
          updateListing) // update listing by id
        
    .delete( protectListing,
        verifyEmail,  
        deleteListing)     // delete listing by id 

Router.route("/image/:id")
        .delete(protectListing,
            verifyEmail,
            deleteImageLiting
        )


export default Router
