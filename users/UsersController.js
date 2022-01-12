const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const adminAuth = require('../middlewares/adminAuth');


//listagem de usuários
router.get('/admin/users', adminAuth, (req, res) => {
    User.findAll()
    .then(users => {
        res.render('admin/users/index', { users });
    })
    .catch(err => console.log(err));
});

//view de cadastro de usuário
router.get('/admin/users/new', adminAuth, (req, res) => {
    res.render('admin/users/new');
});

//criar usuário
router.post('/users/save', adminAuth, (req, res) => {
    let { email, password, name } = req.body;

    User.findOne({ where: { email } })
    .then(user => {
        if(user == undefined) {
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);
        
            User.create({
                email,
                password: hash,
                name
            })
            .then(() => {
                res.redirect('/admin/users');
            })
            .catch(err => res.redirect('/admin/users/new'));
        }
        else {
            res.redirect('/admin/users/new');
        }
    })
    .catch(err => console.log(err));
});

//view de login
router.get('/login', (req, res) => {
    res.render('admin/users/login');
});

//autenticar usuário
router.post('/authenticate', (req, res) => {
    let { email, password } = req.body;
    User.findOne({ where: { email } })
    .then(user => {
        //se encontrar um usuário com o email informado
        if(user != undefined) {
            let correct = bcrypt.compareSync(password, user.password);
            if(correct) {
                req.session.user = { 
                    id: user.id,
                    name: user.name
                };
                res.redirect('/admin/articles');
            }
            else {
                res.redirect('/login');
            }
        }
        else {
            res.redirect('/login');
        }
    })
    .catch(err => console.log(err));
});

router.get('/logout', (req, res) => {
    req.session.user = null;
    res.redirect('/');
});


module.exports = router;