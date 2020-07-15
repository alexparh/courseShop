const {Schema, model} = require('mongoose')

const user = new Schema({
    email:{
        type:String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    cart:{
        items:[
            {
                count:{
                    type:Number,
                    required: true,
                    default:1
                },
                courseId:{
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                }
            }
        ]
    }
})

//используем function для контекста this
user.methods.addToCard = function(course){
     const items = [...this.cart.items]
     const i = items.findIndex(c=>{
         return c.courseId.toString() === course._id.toString()
     })

     if(i>=0){
         //В корзине есть курс, увеличеваем количество
         items[i].count += 1
     } else {
        items.push({
             courseId: course._id,
             count:1
         })
     }

    this.cart = {items} //ключ и значение совпадают
    return this.save()
}

user.methods.removeFromCart = function(id){
    let items = [...this.cart.items]
    const i = items.findIndex(c=>{
        return c.courseId.toString() === id.toString()
    })

    if(items[i].count != 1){
        //В корзине есть курс, уменьшаем количество
        items[i].count -= 1
    } else {
       items.splice(i,1)
    }

   this.cart = {items} //ключ и значение совпадают
   return this.save()
}

user.methods.cleanCart = function(){
    this.cart = {items:[]}
    return this.save()
}

module.exports = model('User', user)