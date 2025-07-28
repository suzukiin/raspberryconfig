const express = require('express');
const app = express();
const { engine } = require('express-handlebars');

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('home');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});