const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const db = require('./databases/sqlite3');

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/configsnmp', (req, res) => {
  db.getConfigs((configs) => {
    res.render('configs', { configs });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});