const { Router } = require('express');
const express = require('express');
const router = express.Router();

const Island = require('../models/island');
const Account = require('../models/account');

// tjek din ø
router.get('/:userId', async (req, res) => {
    try {
        await Account.checkUser(req.params.userId);
        const flowerIdOnIsland = await Island.getFlowerIdOnIsland(req.params.userId);
        console.log(flowerIdOnIsland);
        let flowers = await Island.getFlowersOnIsland(flowerIdOnIsland);
        return res.send(JSON.stringify(flowers));
    } catch (err) {
        return res.status(500).send(JSON.stringify({ errorMessage: err }));
    }
    
});

// tilføj til din ø
router.post('/', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        // previously Login.validate(req.body)
        const { error } = Island.validate(req.body);
        if (error) throw { statusCode: 400, errorMessage: error };

        // previously const loginObj = new Login(req.body);
        const islandFlowerObj = new Island(req.body);
        // previously const user = await loginObj.create();
        await Island.checkFlower(islandFlowerObj);
        const flower = await Island.addFlower(islandFlowerObj);

        // previously user
        return res.send(JSON.stringify(flower));
    } catch (err) {
        console.log(err);
        // need to make the condition check sensible...
        if (!err.statusCode) return res.status(500).send(JSON.stringify({ errorMessage: err }));
        if (err.statusCode != 400) return res.status(err.statusCode).send(JSON.stringify({ errorMessage: err }));
        return res.status(400).send(JSON.stringify({ errorMessage: err.errorMessage.details[0].message }));
    }
});

module.exports = router;