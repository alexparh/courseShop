const {Router} = require('express')
const Course = require('../models/course')
const router = Router()


router.get('/', (req, res) => {
    res.render('add', {
        title: 'Add',
        isAdd: true
    })
})

router.post('/', async (req, res) => {
    //const course = new Course(req.body.title, req.body.price, req.body.imgUrl)
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        imgUrl: req.body.imgUrlб,
        userId: req.user//Посоклько в модели описываем как ObjectID, такая запись возможна, mongoose делает это за нас
    })
    try {
        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router