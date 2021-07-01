'use strict';

const express = require(`express`);
const expressSession = require(`express-session`);
const path = require(`path`);
const mainRoutes = require(`./routes/main`);
const myRoutes = require(`./routes/my`);
const offersRoutes = require(`./routes/offers`);
const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const TEMPLATES_DIR = `templates`;

const app = express();

app.set(`view engine`, `pug`);
app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use(express.urlencoded({extended: false}));

app.use(expressSession({
  secret: `SECRET`,
  resave: false,
  saveUninitialized: false,
}));

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.listen(DEFAULT_PORT);
