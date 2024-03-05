//mongdb is schemaless but schema is required for proper data organisation
const mongoose=require('mongoose')
const expenseTrackSchema=new mongoose.Schema({
    amount:{
        type:Number
    },
    category:{
        type:String
    },
    date:{
        type:String
    }
})
const Expense=mongoose.model('expensedetails',expenseTrackSchema)
module.exports={Expense}
