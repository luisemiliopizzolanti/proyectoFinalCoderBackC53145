import {connect} from "mongoose";


const uri ="mongodb+srv://elfozi:coder.123@coderhouse.oyjb6ae.mongodb.net/coder_backend_53145?retryWrites=true&w=majority&appName=CoderHouse"
export const connectDB = async()=>{
   const res = await connect(uri)
   console.log("DB conectada")
}