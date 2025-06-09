import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../models/user.model.js"
import path from 'path'
export const getCurrentUser =async(req,res)=>{
  try{
    const user = await User.findById(req.userId).select('-password')
        if(!user){
            return res.status(400).json({message:"User doesn't found !"})
        }
     return res.status(200).json(user)
     
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Get current user error"})
    }
    
}

export const updateProfile = async (req, res) => {
  try {
    const { firstname, lastname, username, headline, location, gender } = req.body;

    const skills = req.body.skills ? JSON.parse(req.body.skills) : [];
    const education = req.body.education ? JSON.parse(req.body.education) : [];
    const experience = req.body.experience ? JSON.parse(req.body.experience) : [];
    

    let profileImage;
    let coverImage;

    console.log(req.files); 

    if (req.files?.profileImage) {
      profileImage = await uploadOnCloudinary(req.files.profileImage[0].path);
      console.log('profile path is',req.files.profileImage[0].path)
    }

    if (req.files?.coverImage) {
      coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
      console.log('cover path is',req.files.coverImage[0].path)
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstname,
        lastname,    
        username,
        headline,
        location,
        gender,
        skills,
        education,
        experience,
        ...(profileImage && { profileImage }),
        ...(coverImage && { coverImage }),
      },
      { new: true }
    ).select('-password');

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const getprofile = async(req,res)=>{

        try {
          let {userName} = req.params;
          console.log('user name is :',userName)
          let user = await User.findOne({username:userName}).select('-password')
         
          if(!user){
            return res.status(400).json({message:"username does not exist"})
          }
          return res.status(200).json(user)

        } catch (error) {
          console.log(error)
          return res.status(500).json({message:`get profile post ${error}`})
        }

}

export const search = async(req,res)=>{
        try {
          let {query} = req.query;
    
          if(!query){
            return res.status(400).json({message:"query is required!"})
          }
          let users = await User.find({
            $or:[
              {firstname: {$regex:query, $options:'i'}},
              {lastname: {$regex:query, $options:'i'}},
              {username: {$regex:query, $options:'i'}},
              {skills: {$in:[query]}}
            ]
          })
          return res.status(200).json(users)

        } catch (error) {
          console.log(error)
          return res.status(500).json({message: `Search error ${error}`})
        }
}
 
export const getSuggestedUser = async(req,res)=>{
       try {
           let currentUser = await User.findById(req.userId).select('connection');
           
           let suggestedUsers = await User.find({
           _id:{
             $ne:currentUser, $nin: currentUser.connection
           }
           })
           console.log('current only connection user:',suggestedUsers)
           return res.status(200).json(suggestedUsers)
       } catch (error) {
        console.log(error)
          return res.status(500).json({message: `Suggested user error ${error}`})
       }
}  