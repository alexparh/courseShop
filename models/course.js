const {Schema, model} = require('mongoose')
//Создаем модель которую регистрируем в монгусе
//Для модели создаем схему что бы описать какие поля и связи в ней есть
const course = new Schema({
    //Поле id mongoose добавляет по умолчанию при создании новой модели
    title: {
        type:String,
        required:true
    },
    price: {
        type:Number,
        required:true
    },
    imgUrl: {
        type:String,
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
})

course.method('toClient', function(){
    const course = this.toObject()
    course.id = course._id
    delete course._id
    return course
})

//С помощью функции model регестрируем модель на основе схемы
module.exports = model('Course', course)