

import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    description:{
        type:String,
    },
    content:[
        {type:String}
    ],
    visibility:{
        type:Boolean
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    issues:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Issue"
    }]
    
})

export default mongoose.model("Repository",repositorySchema)