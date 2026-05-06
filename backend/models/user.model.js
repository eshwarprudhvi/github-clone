import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
   repositories:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Repository",
    default:[]
   }],
   followedUsers:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[]
    }
   ],
   starRepositories:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Repository",
        default:[]
    }
   ]
   
})
export default mongoose.model("User",userSchema)