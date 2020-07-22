const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const csurf = require('csurf')
const flash = require('connect-flash')
const handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const orderRoutes = require('./routes/orders')
const cardRoutes = require('./routes/card')
const authRoutes = require('./routes/auth')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorHandler = require('./middleware/error')
const keys = require('./keys')

const MONGODB_URI = 'mongodb+srv://parhom420:Ph3g6MPYMvuPA6D@cluster0.vcvrj.mongodb.net/shopDB'
const app = express()
//Создание и конфиг хэндэлбарс
 const hbs = exphbs.create({
     defaultLayout: 'main',
     extname: 'hbs',
     handlebars: allowInsecurePrototypeAccess(handlebars)
 })

 const store = new MongoStore({
     collection: 'sessions',
     uri: keys.MONGODB_URI

 })

app.engine('hbs', hbs.engine) //Регистрируем как движок рендеринга html
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public'))) //Делаем папку паблик статической
app.use(express.urlencoded({
    extended: true
}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(csurf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes) //Регестрируем роуты
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', orderRoutes)
app.use('/auth', authRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 3000

async function start() {
    try {
        
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()