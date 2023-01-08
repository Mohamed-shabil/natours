const express = require("express");
const viewController = require('../controllers/viewController');
const router = express.Router();
 

router.get("/",viewController.getOverview);

router
    .route('/login')
    .get(viewController.getLoginForm)
    // .post(viewController.)

router.get("/tour/:slug",viewController.getTour);


module.exports = router;
