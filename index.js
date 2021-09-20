const env = require('dotenv').config();
const config = require('config');

const express = require('express');
const app = express();

const cors = require('cors');

// custom middleware
const setContentTypeJSON = require('./middleware/setResponseHeader');

const accounts = require('./routes/accounts');
const flowers = require('./routes/flowers');
const profiles = require('./routes/profiles');

app.use(express.json());
app.use(cors());
app.use(setContentTypeJSON);
app.use('/api/accounts', accounts);
app.use('/api/flowers', flowers);
app.use('/api/profiles', profiles);

app.listen(config.get('port'), () => console.log(`Listening on port ${config.get('port')}...`));