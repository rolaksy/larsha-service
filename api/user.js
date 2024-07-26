const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Store = require('../lib/store');
const Util = require('../lib/util');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TOKEN || "";

const store = new Store(token);

//drop or create table
router.post('/:table', [
    check('csrf').notEmpty().withMessage('Invalid token'),
    check('action').notEmpty().withMessage('Invalid request'),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { body } = req;
    let response = "";
    if (body.action === 'create') {
        response = await store.create(req.params.table);
    }
    if (body.action === 'drop') {
        response = await store.drop(req.params.table);
    }

    if (response == "") {
        return res.status(503).json({ errors: "Unknown Error" });
    }

    return res.status(200).json(response);

});


router.get('/:table/validate', [
    check('email').isEmail().withMessage('Email is required and must be valid'),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { body } = req;
    const response = await store.select(req.params.table, { email: body.email });
    if(response !== null && Array.isArray(response)) {
        const user = response[0];
        if(user.email !== '' && user.key !== '') {
            return res.status(200).json({success: true});
        }
    }
    return res.status(200).json({success: false});

});

router.post('/:table/login', [
    check('email').isEmail().withMessage('Email is required and must be valid'),
    check('password').notEmpty().withMessage('Password is required and must be valid'),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { body } = req;
    const params = { email: body.email };
    const response = await store.select(req.params.table, params);
    if(response !== null && Array.isArray(response) && response.length > 0) {
        const user = response[0];
        if(Util.atob(user.key) == body.password) {
            return res.status(200).json({success: true, user: {email: user.email, firstname: user.firstname, lastname: user.lastname}});
        } else {
            return res.status(200).json({success: false, message: "Invalid email or password"});
        }
    }
    return res.status(200).json({success: false});

});

router.post('/:table/signup', [
    check('email').isEmail().withMessage('Email is required and must be valid'),
    check('firstname').notEmpty().isString().withMessage('First name is required and must be valid'),
    check('lastname').notEmpty().isString().withMessage('Last name is required and must be valid'),
    check('key').notEmpty().isStrongPassword().withMessage('Password is required and must be strong'),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { body } = req;
    const user = await store.select(req.params.table, { email: body.email });
    if(user && user.some(item => item.email === body.email)) {
        return res.status(400).json({ errors: "Cannot create account. User with same email already exist" });
    }
    const params = {
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        key: Util.btoa(body.key)
    }
    const response = await store.insert(req.params.table, params);

    return res.status(200).json(response);

});


module.exports = router;