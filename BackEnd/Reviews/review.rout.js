
import express from 'express';
import { createReview, deleteRevie } from './Review.controller.js';
import { validate } from '../middleware/Validate.js';
import { createReviewSchema } from './ValidationZodReview.js';
const Router = express.Router();


//create revie
Router.route("/:id")
.post(  validate(createReviewSchema),  createReview)

Router.route("/:Lid/:Rid")
    .delete(   deleteRevie)

export default Router;

