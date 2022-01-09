const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT, (error) => {
    console.log('Servidor iniciado na porta:', PORT);
});