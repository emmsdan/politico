const express = require('express');

const app = express();
const port = process.env.PORT || 5051;
app.get('/', (req, res) => {
  res.send('Official App for Politico API');
});

const server = app.listen(port, () => {
  console.log(`Politico API is running on port ${port}`);
});

module.exports = server;