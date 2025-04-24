const { sha512 } = require('js-sha512');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const passwordHash = process.env.PASSWORD_HASH;

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, './dist')));
app.use(express.json());

app.use((req, res, next) => {
  const password = req.headers['x-password'] ?? '';
  if (sha512(password) === passwordHash) return void next();
  res.sendStatus(401);
});

app.get('/:bucket', (req, res) => {
  res.setHeader('content-type', 'application/json');

  try {
    const data = fs.readFileSync(`${req.params.bucket}.json`);
    res.send(data);
  } catch (err) {
    res.sendStatus(404);
  }
});

app.post('/:bucket', (req, res) => {
  if (req.body) fs.writeFileSync(`${req.params.bucket}.json`, JSON.stringify(req.body));
  res.sendStatus(200);
});

app.listen(process.env.PORT, () => console.log('Server is listening!'));
