
import express from 'express';
import { createReview, deleteRevie } from './Review.controller.js';
const Router = express.Router();


//create revie
Router.route("/:id")
.post(  createReview)

Router.route("/:Lid/:Rid")
    .delete(   deleteRevie)

export default Router;

