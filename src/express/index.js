'use strict';

const express = require(`express`);
const mainRoutes = require(`./routes/main`);
const myRoutes = require(`./routes/my`);
const offersRoutes = require(`./routes/offers`);
const DEFAULT_PORT = 8080;

const app = express();

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.listen(DEFAULT_PORT);
