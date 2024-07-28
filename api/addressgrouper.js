const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const ApiResponse = require('./ApiResponse');

const AddressGrouperController = require('../controllers/addressGrouperController');

// Middleware to handle UserController initialization
const initializeController = (req, res, next) => {
    req.controller = new AddressGrouperController(req, res);
    res.apiResponse = new ApiResponse(res);
    next();
};

//drop or create table
router.post('/group-addresses', [
    check('addresses').isArray().withMessage("Address list is invalid"),
    initializeController
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.apiResponse.error(errors.array());
    }
    return await req.controller.groupAddresses();
});


module.exports = router;