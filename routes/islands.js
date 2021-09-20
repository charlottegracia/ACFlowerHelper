const { Router } = require('express');
const express = require('express');
const router = express.Router();

const Island = require('../models/island');
//const Author = require('../models/author');

// tjek din ø
/* router.get('/', async (req, res) => {
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
}); */

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
        const flowerCheck = await Island.checkFlower(islandFlowerObj);
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

/* router.post('/login', async (req, res) => {
    // res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Expose-Headers', 'x-authenticate-token');
    try {
        // previously Login.validate(req.body)
        const { error } = Account.validate(req.body);
        if (error) throw { statusCode: 400, errorMessage: error };

        // previously const loginObj = new Login(req.body)
        const accountObj = new Account(req.body);
        // previously const user = await Login.readByEmail(loginObj)
        const account = await Account.checkCredentials(accountObj);

        const token = await jwt.sign(account, secret);
        res.setHeader('x-authenticate-token', token);
        // previously user
        return res.send(JSON.stringify(account));

    } catch (err) {
        console.log(err);
        // need to make the condition check sensible...
        if (!err.statusCode) return res.status(401).send(JSON.stringify({ errorMessage: 'Incorrect user email or password.' }));
        if (err.statusCode != 400) return res.status(401).send(JSON.stringify({ errorMessage: 'Incorrect user email or password.' }));
        return res.status(400).send(JSON.stringify({ errorMessage: err.errorMessage.details[0].message }));
    }
});
 */

module.exports = router;