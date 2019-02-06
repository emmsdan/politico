/* eslint-disable import/named */
import '@babel/polyfill';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import path from 'path';
import formidable from 'formidable';

import { init } from './migration';

import authRouter from './server/route/authRouter';
import officeRouter from './server/route/officeRouter';
import partyRouter from './server/route/partyRouter';
import electionRouter from './server/route/electionRouter';
import validate from './server/helper/validate';

dotenv.config();

const app = express();
const port = process.env.PORT || 5051;
const documentation = path.join(__dirname, 'doc');

app.use(express.static('frontend'));
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


app.purge('/migrate', (req, res) => {
  init().then((response) => {
    res.status(200).json({ m: 'migrated', response });
  }).catch((err) => {
    res.status(200).json({ m: 'not migrated', e: err.message });
  });
});

/**
 * main api routes
 */

app.use('/doc', (req, res) => {
  res.sendFile(path.join(documentation, 'documentation.html'));
});

app.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm();
  const randName = validate.generateChar(10);
  form.parse(req);
  form.on('fileBegin', (name, file) => {
    file.path = `${__dirname}/frontend/img/upload/X${randName}${file.name}`;
  });
  form.on('file', (name, file) => res.status(201).json({ url: file.path.split('frontend')[1] }));
});

app.use('/api/v1/auth', authRouter);

app.use('/api/v1/offices', officeRouter);
app.use('/api/v1/parties', partyRouter);
app.use('/api/v1/', electionRouter);

app.get(['/', '/api/', '/api/v1/', '/api/v2/'], (req, res) => {
  res.send('Official App for Politico API');
});
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Oh dear, this link isn’t working.',
  });
});

if (!module.parent) {
  app.listen(port, () => {
    console.log(`Politico API is running on port ${port}`);
  });
}
export default app;
