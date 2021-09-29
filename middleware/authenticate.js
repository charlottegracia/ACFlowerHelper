const jwt = require('jsonwebtoken');
const config = require('config');

const secret = config.get('jwt_secret_key');

module.exports = async (req, res) => {
    const token = req.header('x-authenticate-token');
    if (!token || token === 'null') return res.status(401).send(JSON.stringify({errorMessage: 'Access denied: no token provided.'}));

    // if (token == 'OK') next();
    // return res.status(400).send(JSON.stringify({errorMessage: 'Invalid token.'}));

    try {
        jwt.verify(token, secret);
    } catch (error) {
        return res.status(400).send(JSON.stringify({errorMessage: 'Invalid token.'}));
    }
}