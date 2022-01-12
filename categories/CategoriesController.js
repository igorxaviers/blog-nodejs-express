const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');


//view de cadastro de categoria
router.get('/admin/categories/new', adminAuth, (req, res) => {
    res.render('admin/categories/new');
});

//listar categorias
router.get('/admin/categories', adminAuth, (req, res) => {
    Category.findAll()
    .then(categories => {
        res.render('admin/categories/index', {
            categories
        });
    });
});

//criar categoria
router.post('/categories/save', adminAuth, (req, res) => {
    let title = req.body.title;
    if(title != undefined) {
        Category.create({
            title,
            slug: slugify(title)
        })
        .then(() => {
            res.redirect('/admin/categories');
        })
        .catch(err => console.log(err));
    } 
    else {
        res.redirect('/admin/categories/new');
    }
});

//deletar categoria
router.post('/categories/delete', adminAuth, (req, res) => {
    let id = req.body.id;
    if(id != undefined) {
        if(!isNaN(id)) {
            Category.destroy({
               where: { id } 
            })
            .then(() => {
                res.redirect('/admin/categories');
            })
            .catch(err => res.redirect('/admin/categories'));
        }
        else {
            res.redirect('/admin/categories');
        }
    }
});

//buscar dados para edição da categoria
router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
    let id = req.params.id;

    isNaN(id) ? res.redirect('/admin/categories') : null;

    Category.findByPk(id)
    .then(category => {
        if(category) {
            res.render('admin/categories/edit', {
                category
            });
        }
        else {
            res.redirect('/admin/categories');
        }
    })
    .catch(err => res.redirect('/admin/categories'));
});

//atualizar categoria
router.post('/categories/update', adminAuth, (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
     
    Category.update({
        title,
        slug: slugify(title)}, 
        { where: { id } } 
    )
    .then(() => {
        res.redirect('/admin/categories');
    })
    .catch(err => console.log(err));

});

module.exports = router;