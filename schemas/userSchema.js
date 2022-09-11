const mongoose=require('mongoose')

const loginDetailsSchema=new mongoose.Schema({
    registration_number:{
        type:String,
        required:true,
     },
     first_name:{
        type:String,
        required:true
     },
     last_name:{
        type:String,
        required:true
     },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        index:{
            unique:true
        }
    },
    mobile_number:{
        type:Number,
        required:true
    },
   

    
})

const loginData=mongoose.model('participants',loginDetailsSchema)
module.exports=loginData