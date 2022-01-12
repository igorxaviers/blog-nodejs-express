const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const Article = require('./Article');
const Category = require('../categories/Category');

//listar artigos
router.get('/admin/articles', (req, res) => {
    Article.findAll({ include: [{model: Category}] })
    .then(articles => {
        console.log(articles);
        res.render('admin/articles/index', { articles });
    })
    .catch(err => console.log(err));
});

//view de cadastro de artigo
router.get('/admin/articles/new', (req, res) => {
    Category.findAll()
    .then(categories => {
        res.render('admin/articles/new', {categories});
    })
    .catch(err => console.log(err));
});

//criar artigo
router.post('/articles/save', (req, res) => {
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
router.post('/articles/delete', (req, res) => {
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
router.get('/admin/articles/edit/:id', (req, res) => {
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
router.post('/articles/update', (req, res) => {
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
    let page = req.params.page;
    let offset = 0;
    let limit = 4;

    if(isNaN(page) || page == 1) {
        offset = 0;
    }
    else {
        offset = parseInt(page) * limit;
    }

    Article.findAndCountAll({ limit, offset })
    .then(articles => {
        //next: se existir mais páginas
        let next = false;
        if(offset + limit >= articles.count) {
            next = false;
        }
        else {
            next = true;
        }

        let result = { offset, limit, articles, next};
        res.json(result);
    })
    .catch(err => console.log(err));

});

module.exports = router;