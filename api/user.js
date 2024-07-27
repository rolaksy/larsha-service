const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Store = require('../lib/store');
const StoreUtil = require('../lib/storeUtil');
const dotenv = require('dotenv');
const ApiResponse = require('./ApiResponse');

const UserController = require('../controllers/userController');

dotenv.config();
const token = process.env.TOKEN || "";
const store = new Store(token);


// Middleware to handle UserController initialization
const initializeController = (req, res, next) => {
    req.userController = new UserController(req, res);
    res.apiResponse = new ApiResponse(res);
    next();
};

//drop or create table
router.post('/:table', [
    check('csrf').notEmpty().withMessage('Invalid token'),
    check('action').notEmpty().withMessage('Invalid request'),
    initializeController
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.apiResponse.error(errors.array());
    }
    return await req.userController.createOrDrop();
});

//validate user based on email
router.get('/:table/validate', [
    check('email').isEmail().withMessage('Email is required and must be valid'),
    initializeController
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.apiResponse.error(errors.array());
    }
    return await req.userController.validateUser();
});

//user login
router.post('/:table/login', [
    check('email').isEmail().withMessage('Email is required and must be valid'),
    check('password').notEmpty().withMessage('Password is required and must be valid'),
    initializeController
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.apiResponse.error(errors.array());
    }
    return await req.userController.login();
});


router.post('/:table/signup', [
    check('email').isEmail().withMessage('Email is required and must be valid'),
    check('firstname').notEmpty().isString().withMessage('First name is required and must be valid'),
    check('lastname').notEmpty().isString().withMessage('Last name is required and must be valid'),
    check('password').notEmpty().isStrongPassword().withMessage('Password is required and must be strong'),
    initializeController
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    return await req.userController.createAccount();
});


module.exports = router;