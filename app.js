import express from 'express';
import { urlencoded, json } from 'body-parser';
import config  from './server/config/environment';
import partyRouter from './server/route/partyRouter';

const app = express();
const port = config.port || 8000;

app.use(urlencoded({ extended: true }));
app.use(json());

app.get('/', (req, res) => {
  res.send('Official App for Politico API');
});
app.use('/api/v1/parties', partyRouter);

if (!module.parent) {
  app.listen(port, () => {
    console.log(`Politico API is running on port ${port}`);
  });
}
export default app;
