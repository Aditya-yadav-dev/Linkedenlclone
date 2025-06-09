import uploadOnCloudinary from "../config/cloudinary.js";
import { io } from "../index.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";

export const createPost = async(req,res)=>{
    try {
        let {description} = req.body;
        let newPost;
        if(req.file){
            let image = await uploadOnCloudinary(req.file.path)
            console.log("single image url is:",image)
            newPost = await Post.create({
                description,
                author: req.userId,
                image
            })
        }
        else{
            newPost = await Post.create({
                description,
                author: req.userId,
            })
        }
        return res.status(201).json(newPost)

    } catch (error) {
        return res.status(500).json(`create post error ${error}`)

    }
}


export const getPost = async(req,res)=>{
     try {
        
        const post = await Post.find().populate("author","firstname lastname profileImage username headline").sort({createdAt: -1}).populate('comment.user', 'firstname lastname profileImage headline');  
        if(!post){
            return res.status(400).json({message:"post is empty"})
        }
        return res.status(200).json(post)
     } catch (error) {
        return res.status(500).json({message: "getPost error"})
     }
}

export const like = async(req,res) => { 
        try {
            let postId = req.params.id;
            let userId = req.userId;
            let post = await Post.findById(postId);
            if(!post){
               return res.status(400).json({message:"post not found"})
            }
            if(post.like.includes(userId)){
             post.like = post.like.filter((id)=> id!= userId )
            }else{
               post.like.push(userId)
               if(post.author!=userId){
               let notification = await Notification.create({
                receiver: post.author,
                type: "like",
                relatedUser:userId,
                relatedPost: postId
               })
            }
            }
            await post.save()
            io.emit("likeUpdated",{postId, likes: post.like})
            return res.status(200).json(post)
   
        } catch (error) {
            return res.status(500).json({message:`like error${error}`})
        }
     }

export const comment = async(req,res) => { 
         try {
            let postId = req.params.id 
            let userId = req.userId
            let {content} = req.body

            const post = await Post.findByIdAndUpdate(
                postId,
                {
                  $push: { comment: { content, user: req.userId } } 
                },
                { new: true }
              ).populate('comment.user', 'firstname lastname profileImage headline');
     if(post.author!=userId){
               let notification = await Notification.create({
                receiver: post.author,
                type:"comment",
                relatedUser:userId,
                relatedPost: postId     
               })
            }  

              io.emit("commentAdded",{postId,comm: post.comment})
              return res.status(200).json(post)


         } catch (error) {
            return res.status(500).json({message:`comment error ${error}`})
         }

       }      