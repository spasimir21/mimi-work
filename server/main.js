const express = require('express');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const passwordHash = process.env.PASSWORD_HASH;

const app = express();

app.use(express.static(path.join(__dirname, './dist')));
app.use(express.json());

const hash = text => crypto.createHash('sha1').update(text).digest('hex');

app.use((req, res, next) => {
  const password = req.headers['x-password'] ?? '';
  if (hash(password) === passwordHash) return void next();
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

app.listen(process.env.PORT ?? 3000, () => console.log('Server is listening!'));
