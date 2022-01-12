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

//importação das models
const Category = require('./categories/Category');
const Article = require('./articles/Article');
const { redirect } = require('express/lib/response');

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

//rota home
app.get('/', (req, res) => {
    Article.findAll({ 
        include: Category,
        order: [['id','DESC']]
    })
    .then(articles => {
        Category.findAll()
        .then(categories => {
            res.render('index', { articles, categories });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

//rota de artigo por slug
app.get('/:slug', (req, res) => {
    let slug = req.params.slug;
    Article.findOne({
        where: { slug },
        include: Category
    })
    .then(article => {
        if(article != undefined) {
            Category.findAll()
            .then(categories => {
                res.render('article', { article, categories });
            })
            .catch(err => console.log(err));
        }
        else {
            res.redirect('/');
        }
    })
    .catch(err => res.redirect('/'));
});

app.get('/category/:slug', (req, res) => {
    let slug = req.params.slug;
    Category.findOne({
        where: { slug },
        include: Article.findOne({
            include: Category
        })
    })
    .then(category => {
        if(category != undefined) {
            Category.findAll({ })
            .then(categories => {
                console.log(category.articles);
                res.render('index', { articles: category.articles, categories });
            })
            .catch(err => console.log(err));
        }
        else {
            res.redirect('/');
        }
    })
    .catch(err => res.redirect('/'));
});

//iniciando o servidor
app.listen(PORT, (error) => {
    console.log('Servidor iniciado na porta:', PORT);
});