import dotenv from 'dotenv';
import express from 'express';
import { urlencoded, json } from 'body-parser';
import cookieParser from 'cookie-parser';

import partyRouter from './server/route/partyRouter';
import officeRouter from './server/route/officeRouter';

dotenv.config();


const app = express();
const port = process.env.PORT || 5051;

app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(json());

app.use('/api/v1/parties', partyRouter);
app.use('/api/v1/offices', officeRouter);

app.get(['/', '/api/', '/api/v1/', '/api/v2/'], (req, res) => {
  res.send('Official App for Politico API');
});
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Oh dear, this link isn’t working. May be',
    error: [
      'you mistyped the URL',
      'you copy-and-paste error',
      'a broken link',
      'it was moved or deleted content'
    ]
  });
});


if (!module.parent) {
  app.listen(port, () => {
    console.log(`Politico API is running on port ${port}`);
  });
}

export default app;
