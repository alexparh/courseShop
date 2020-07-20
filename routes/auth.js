const bcrypt = require('bcryptjs')
const {Router} = require('express')
const User = require('../models/user')
const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: 'true',
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
})

router.post('/login', async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body
        const candidate = await User.findOne({
            email
        })
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)
            if (areSame) {
                const user = candidate
                req.session.user = user
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                })
                res.redirect('/')
            } else {
                req.flash('loginError', 'Email или пароль введены не правильно')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('loginError', 'Email или пароль введены не правильно')
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log(e)
    }
})

router.post('/register', async (req, res) => {
    try {
        const {
            email,
            name,
            password,
            repeat
        } = req.body
        const candidate = await User.findOne({
            email
        })

        if (candidate) {
            req.flash('registerError', 'Пользователь с таким email уже сущетсвует')
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email,
                name,
                password: hashPassword,
                cart: {
                    items: []
                }
            })
            await user.save()
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log(e)
    }
})

router.get('/logout', async (req, res) => {
    //req.session.isAuthenticated = false
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

module.exports = router