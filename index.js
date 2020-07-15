const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const orderRoutes = require('./routes/orders')
const cardRoutes = require('./routes/card')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const User = require('./models/user')
const app = express()
//Создание и конфиг хэндэлбарс
 const hbs = exphbs.create({
     defaultLayout: 'main',
     extname: 'hbs',
     handlebars: allowInsecurePrototypeAccess(handlebars)
 })

app.engine('hbs', hbs.engine) //Регистрируем как движок рендеринга html
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next)=>{
    try{
        const user = await User.findById('5f073903d0095b25c8f5ca5c')
        req.user = user
        next()
    } catch(e){
        console.log(e)
    }
})

app.use(express.static(path.join(__dirname, 'public'))) //Делаем папку паблик статической
app.use(express.urlencoded({
    extended: true
}))
app.use('/', homeRoutes) //Регестрируем роуты
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', orderRoutes)

const PORT = process.env.PORT || 3000

async function start() {
    try {
        const url = 'mongodb+srv://parhom420:Ph3g6MPYMvuPA6D@cluster0.vcvrj.mongodb.net/shopDB'
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        const candidate = await User.findOne()
        if(!candidate){
            const user = new User({
                email: 'shasha.parh@gmail.com',
                name: 'Alexandr',
                cart:{items:[]}
            })
            await user.save()
        }
        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()