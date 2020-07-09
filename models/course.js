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
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

//С помощью функции model регестрируем модель на основе схемы
module.exports = model('Course', course)
//No dataBase
// const {uuid} = require('uuidv4')
// const fs = require('fs')
// const path = require('path')

// class Course {
//     constructor(title, price, imgUrl) {
//         this.title = title
//         this.price = price
//         this.imgUrl = imgUrl
//         this.id = uuid()
//     }

//     toJSON() {
//         return {
//             title: this.title,
//             price: this.price,
//             imgUrl: this.imgUrl,
//             id: this.id
//         }
//     }

//     static async update(course){
//         const courses = await Course.getAll()
//         const ind = courses.findIndex(c=>c.id===course.id)
//         courses[ind] = course

//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 JSON.stringify(courses),
//                 (err, content) => {
//                     if (err) {
//                         reject(err)
//                     } else {
//                         resolve()
//                     }
//                 }
//             )
//         })
//     }

//     async save() {
//         const courses = await Course.getAll()
//         courses.push(this.toJSON())

//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 JSON.stringify(courses),
//                 (err, content) => {
//                     if (err) {
//                         reject(err)
//                     } else {
//                         resolve()
//                     }
//                 }
//             )
//         })
//     }

//     static getAll() {
//         return new Promise((resolve, reject) => {
//             fs.readFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 'utf-8',
//                 (err, content) => {
//                     if (err) {
//                         reject(err)
//                     } else {
//                         resolve(JSON.parse(content))
//                     }
//                 }
//             )
//         })
//     }

//     static async getByID(id){
//         const courses = await Course.getAll()
//         return courses.find(c => c.id === id)
//     }
// }

// module.exports = Course