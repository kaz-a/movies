const express = require('express'),
  app = express(),
  chalk = require('chalk'),
  path = require('path'),
  port = process.env.PORT || 3030;

app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/data', express.static(path.join(__dirname, 'data')));

app.get('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.use('/', (err, req, res, next) => {
  res.status(err.status).send(err.message);
})

app.listen(port, () => {
  console.log(chalk.yellow(`server listening on port ${port}...`));
})