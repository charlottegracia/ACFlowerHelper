const { Router } = require('express');
const express = require('express');
const router = express.Router();

const Flower = require('../models/flower');
//const Author = require('../models/author');

// få alle blomster
router.get('/', async (req, res) => {
    // need to call the Book class for DB access...
    /* let authorid;
    if (req.query.author) {
        authorid = parseInt(req.query.author);
        if (!authorid) return res.status(400).send(JSON.stringify({ errorMessage: 'Bad request: ?author= should refer an author id (integer)' }));
    } */

    try {
        //const flowers = await Flower.readAll(authorid);
        const flowers = await Flower.getAll();
        return res.send(JSON.stringify(flowers));
    } catch (err) {
        return res.status(500).send(JSON.stringify({ errorMessage: err }));
    }
});

// få en bestemt blomst ud fra id
router.get('/:flowerId', async (req, res) => {
    // › › validate req.params.bookid as bookid
    // › › call await Book.readById(req.params.bookid)
    const {error} = Flower.validate(req.params);
    if (error) return res.status(400).send(JSON.stringify({ errorMessage: 'Bad request: flowerId has to be an integer', errorDetail: error.details[0].message }));

    try {
        const flower = await Flower.readById(req.params.flowerId);
        return res.send(JSON.stringify(flower));
    } catch (err) {
        return res.status(500).send(JSON.stringify({ errorMessage: err }));
    }
});

module.exports = router;