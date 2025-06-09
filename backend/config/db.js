import mongoose from "mongoose";

const connectdb = async()=>{
    try{
      console.log('mongodb url is:',process.env.MONGODB_URL)
      mongoose.connect(process.env.MONGODB_URL)
     console.log('Db connected successfully')
    } 
    catch(error){
      console.log('Db error', error)
    }
    
}

export default connectdb;