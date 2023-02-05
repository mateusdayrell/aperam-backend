/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const dotenv = require('dotenv');
const { resolve } = require('path');
const cors = require('cors');

const routes = require('./routes/routes');
require('./database/connection'); // connect to database;

dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(resolve(__dirname, '..', 'uploads')));
app.use('/', routes);

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log('🚀 NodeJS server launched on http://localhost:3333/');
});
