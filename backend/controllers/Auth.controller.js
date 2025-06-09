import { genToken } from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
export const signup = async(req,res)=>{
    try {
      const {firstname, lastname, username, password, email} = req.body;
     
      const existemail = await  User.findOne({email})      
      if(existemail){
        return res.status(400).json({message: "email already exists !"})
      }
      const existusername = await User.findOne({username})
      if(existusername){
        return res.status(400).json({message: "username already exists !"})
      }
      if(password.length < 8){
        return res.status(400).json({message: "password must be atleast 8 character"})
      }
      const hashedpassword = await bcrypt.hash(password,10)
      const user = await User.create({
        firstname,
        lastname,
        username, 
        password: hashedpassword, 
        email    
      })
    const token = genToken(user._id)
    res.cookie('token',token,{
        httpOnly: true,
        maxAge: 7*24*60*60*1000,
        sameSite: "Strict",
        secure: process.env.NODE_ENV==='production'
    })
      return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json({message: error})
    }
}

export const login = async(req,res)=>{
    try {
        const {password, email} = req.body;
        const user = await User.findOne({email})      
        if(!user){
          return res.status(400).json({message: "user does not exists !"})
        }
       
        const ismatched = await bcrypt.compare(password,user.password)
        if(!ismatched){
            res.status(400).json({message: "password incorrect"})
        }
     
      const token = genToken(user._id)
      // console.log('token type is', typeof token)
      // console.log('token in login', token)
      res.cookie('token', token ,{
          httpOnly: true,
          maxAge: 7*24*60*60*1000,
          sameSite: "Strict",
          secure: process.env.NODE_ENV==='production'
      })
      console.log('token in login', req.cookies)
        return res.status(200).json(user)
       
  
      } catch (error) {
          return res.status(500).json({message: error})
      }
}

export const logOut = (req,res)=>{
    try {
        res.clearCookie('token')
        return res.status(200).json({message:"logout succesfully"})
    } catch (error) {
        res.status(500).json({message: error})
    }
}