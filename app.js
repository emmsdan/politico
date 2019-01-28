import express from 'express';
import { urlencoded, json } from 'body-parser';

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

app.get('/', (req, res) => {
  res.send('Official App for Politico API');
});

if (!module.parent) {
  app.listen(port, () => {
    console.log(`Politico API is running on port ${port}`);
  });
}
export default app;
