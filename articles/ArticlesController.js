const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const Article = require('./Article');
const Category = require('../categories/Category');
const adminAuth = require('../middlewares/adminAuth');

//listar artigos
router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({ 
        include: [{model: Category}],
        order: [['id', 'DESC']]
    })
    .then(articles => {
        console.log(articles);
        res.render('admin/articles/index', { articles });
    })
    .catch(err => console.log(err));
});

//view de cadastro de artigo
router.get('/admin/articles/new', adminAuth, (req, res) => {
    Category.findAll()
    .then(categories => {
        res.render('admin/articles/new', {categories});
    })
    .catch(err => console.log(err));
});

//criar artigo
router.post('/articles/save', adminAuth, (req, res) => {
    let title = req.body.title;
    let body = req.body.body;
    let categoryId = req.body.categoryId;

    if(title != undefined && body != undefined && categoryId != undefined) {
        Article.create({
            title,
            body,
            slug: slugify(title),
            categoryId
        })
        .then(() => {
            res.redirect('/admin/articles');
        })
        .catch(err => res.redirect('/admin/articles'));
    }
});

//deletar artigo
router.post('/articles/delete', adminAuth, (req, res) => {
    let id = req.body.id;
    if(id != undefined) {
        if(!isNaN(id)) {
            Article.destroy({
               where: { id } 
            })
            .then(() => {
                res.redirect('/admin/articles');
            })
            .catch(err => res.redirect('/admin/articles'));
        }
        else {
            res.redirect('/admin/articles');
        }
    }
});

//buscar dados para edição da artigo
router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    let id = req.params.id;
    Article.findByPk(id)
    .then(article => {
        if(article) {
            Category.findAll()
            .then(categories => {
                res.render('admin/articles/edit', { article, categories });
            })
            .catch(err => console.log(err));
        }
        else {
            res.redirect('/admin/articles');
        }
    })
    .catch(err => res.redirect('/admin/articles'));
});

//atualizar artigo
router.post('/articles/update', adminAuth, (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let categoryId = req.body.categoryId;

    if(id != undefined && title != undefined && body != undefined && categoryId != undefined) {
        Article.update({
            title,
            body,
            slug: slugify(title),
            categoryId
        }, { where: { id } })
        .then(() => {
            res.redirect('/admin/articles');
        })
        .catch(err => console.log(err));
    }
    else {
        console.log('error');
    }
});

//paginação
router.get('/articles/page/:page', (req, res) => {
    let page = parseInt(req.params.page);
    let offset = 0;
    let limit = 8;

    if(isNaN(page) || page == 1) {
        offset = 0;
    }
    else {
        offset = (page - 1) * limit;
    }

    Article.findAndCountAll({ 
        limit,
        offset,
        include: Category,
        order: [['id', 'DESC']]
    })
    .then(articles => {
        //next: se existir mais páginas
        let next = false;
        if(offset + limit >= articles.count) {
            next = false;
        }
        else {
            next = true;
        }
        let result = { 
            articles,
            next,
            page
        };
        Category.findAll()
        .then(categories => {
            res.render('admin/articles/page', { result, categories });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

module.exports = router;