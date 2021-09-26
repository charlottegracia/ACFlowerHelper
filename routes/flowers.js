const { Router } = require('express');
const express = require('express');
const router = express.Router();

const Flower = require('../models/flower');

// get all flowers
router.get('/', async (req, res) => {
    try {
        const flowers = await Flower.getAll();
        return res.send(JSON.stringify(flowers));
    } catch (err) {
        return res.status(500).send(JSON.stringify({ errorMessage: err }));
    }
});

// get specific flower from ID
router.get('/:flowerId', async (req, res) => {
    const {error} = Flower.validate(req.params);
    if (error) return res.status(400).send(JSON.stringify({ errorMessage: 'Bad request: flowerId has to be an integer', errorDetail: error.details[0].message }));

    try {
        let flower = [];
        flower[0] = await Flower.readById(req.params.flowerId);
        if (flower[0].breedingFlower1 != null) {
            flower[1] = await Flower.findBreedingFlower(flower[0].breedingFlower1);
            flower[2] = await Flower.findBreedingFlower(flower[0].breedingFlower2);
        }
        return res.send(JSON.stringify(flower));
    } catch (err) {
        return res.status(500).send(JSON.stringify({ errorMessage: err }));
    }
});

module.exports = router;