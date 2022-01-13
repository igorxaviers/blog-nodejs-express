//variáveis básicas
const express = require('express');
const bodyparser = require('body-parser');
const connection = require('./database/database');
const session = require('express-session');

const app = express();

//congiduração do express-session
app.use(session({
    secret: 'tubarão albino',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 2 //2 dias
        // maxAge: 30000 //30 segundos
    }
}));

//definicão de porta
const PORT = process.env.PORT || 3000;

//importação de controllers
const CategoriesController = require('./categories/CategoriesController');
const ArticlesController = require('./articles/ArticlesController');
const UsersController = require('./users/UsersController');

//importação das models
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
app.use('/', UsersController);

//rota home
app.get('/', (req, res) => {
    Article.findAll({ 
        include: Category,
        order: [['id','DESC']],
        limit: 8
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

//rota de artigos por categoria
app.get('/category/:slug', (req, res) => {
    let slug = req.params.slug;
    Category.findOne({
        where: { slug },
        include: Article
    })
    .then(category => {
        if(category != undefined) {
            Category.findAll()
            .then(categories => {
                // res.json({ category, categories });
                res.render('articles-category', { articles: category.articles, categories, category });
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