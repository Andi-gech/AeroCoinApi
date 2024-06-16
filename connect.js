const mongoose=require('mongoose')

const connect=()=>{
    return mongoose.connect('mongodb+srv://andifab23:uQ91DtVyt1wKdfYp@cluster0.bnkfsl8.mongodb.net/')
}
module.exports=connect