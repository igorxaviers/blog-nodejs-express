//variáveis básicas
const express = require('express');
const bodyparser = require('body-parser');
const connection = require('./database/database');
const app = express();

//definicão de porta
const PORT = process.env.PORT || 5000;
//importação de controllers
const CategoriesController = require('./categories/CategoriesController');
const ArticlesController = require('./articles/ArticlesController');

const Category = require('./categories/Category');
const Article = require('./articles/Article');

//configurando body-parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
//configurando view engine do express
app.set('view engine', 'ejs');
//configurando pasta public
app.use(express.static('public'));


//conexão com banco
connection
    .authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados realizada com sucesso!');
    })
    .catch(err => {console.log(err)});

//integrando dos controllers com o express
app.use('/', CategoriesController);
app.use('/', ArticlesController);

app.get('/', (req, res) => {
    res.render('index');
});

//iniciando o servidor
app.listen(PORT, (error) => {
    console.log('Servidor iniciado na porta:', PORT);
});