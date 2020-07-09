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

}

module.exports = model('User', user)