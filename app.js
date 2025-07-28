const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public'))); // Pasta com seu HTML

app.get('/', (req, res) => {
  res.sendFile('index.html'); // Envia o arquivo HTML
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});