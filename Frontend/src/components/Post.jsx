import React, { useState, useContext, useEffect } from 'react'
import profile from '../assets/profile.png'
import moment from 'moment'
import { FaRegCommentDots } from "react-icons/fa";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { LuSendHorizontal } from "react-icons/lu";

import axios from 'axios';
import { AuthDataContext } from '../context/AuthContext';
import { socket, UserDataContext } from '../context/UserContext';
import ConnectionButton from './ConnectionButton';

const Post = ({ id, author, image, comment, description, like, createdAt }) => {
    const [more, setmore] = useState(false)
    const [likes, setlikes] = useState(like || [])
    const [commentContent, setcommentContent] = useState('')
    const { ServerUrl } = useContext(AuthDataContext)
    const { getPost, userData,handleGetProfile} = useContext(UserDataContext)
    const [comments, setcomments] = useState(comment || [])
    const [showcomments, setshowcomments] = useState(false)
    const Like = async () => {
        // console.log('user is:',userData._id)
        // console.log('auhtor is:',author._id)
        try {
          
            let result = await axios.get(ServerUrl + `/api/post/like/${id}`,
                { withCredentials: true }
            )
            console.log(result)
            setlikes(result.data.like)
        } catch (error) {
            console.log(error)
        }
    }
    const commenthandler = async (e) => {
        e.preventDefault();
        try {
            let result = await axios.post(ServerUrl + `/api/post/comment/${id}`,
                { content: commentContent },
                { withCredentials: true }
            )
            console.log(result.data.comment)
            console.log(result.data)
            setcomments(result.data.comment)
            setcommentContent('')
        } catch (error) {
            console.log(error)
        }
    }
    
    useEffect(() => {
      socket.on('likeUpdated',({postId, likes})=>{
        if(postId==id){
            setlikes(likes)
        }
      })

      socket.on('commentAdded',({postId,comm})=>{
        if(postId==id){
            setcomments(comm)
        }
      })
      
      return ()=>{
        socket.off("likeUpdated")
        socket.off("commentAdded")
      }

    },[id])
    

    useEffect(() => {
        setlikes(like)
        setcomments(comment)
    }, [like, comment])



    return (
        <div className='w-full min-h-[200px] bg-white rounded-lg shadow-lg p-5 flex flex-col gap-2'>
            <div className='flex justify-between items-center'>
                <div onClick={()=>{handleGetProfile(author.username)}}  className='flex justify-center items-start gap-[10px]'>
                    <div className='w-[68px] h-[68px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer'>
                        <img src={author.profileImage || profile} className='w-full' />
                    </div>
                     <div>
                        <div className='text-[20px] font-[550] capitalize'>{`${author.firstname} ${author.lastname}`}</div>
                        <div className='text-[18] text-gray-600 font-[470] mt-[-4px]'>{author.headline}</div>
                        <div className='text-[18] text-gray-600 font-[470] mt-[-4px]'>{moment(createdAt).fromNow()}</div>
                    </div>

                </div>
                <div>
                { userData._id!== author._id && <ConnectionButton  userId={author._id} />}
                </div>
            </div>
            <div className={`w-full ${!more ? "max-h-[100px] overflow-hidden" : ""} pl-[58px]`}>{description}</div>
            <div className='pl-[50px] text-[19px] font-semibold cursor-pointer' onClick={() => { setmore(!more) }}>{more ? "read less..." : "read more..."}</div>
            {image && <div className='w-full flex justify-center h-[300px] overflow-hidden rounded-lg'> <img src={image} className='h-full rounded-lg' /></div>}

            <div>
                <div className='w-full flex justify-between items-center p-5 border-b-2 border-gray-500'>
                    <div className='flex items-center justify-center gap-[5px] text-[18px]'>
                        <BiLike className='text-[#1ebbff] w-5 h-5' /><span>{likes.length}</span>
                    </div>
                    <div className='flex items-center justify-center gap-[5px] text-[18px] cursor-pointer' onClick={()=>{setshowcomments(!showcomments)}}>
                        <span>{comments.length}</span><span>comments</span>
                    </div>
                </div>
                <div className='flex items-center justify-start gap-4 p-5'>
                    {!likes.includes(userData._id) && <div className='flex justify-center items-center gap-1 text-[18px]'>
                        <BiLike onClick={Like} className='text-[#1ebbff] w-6 h-5 cursor-pointer' />
                        <span>Like</span>
                    </div>}
                    {likes.includes(userData._id) && <div className='flex justify-center items-center gap-1 text-[18px]'>
                        < BiSolidLike onClick={Like} className='text-[#1ebbff] w-6 h-5 cursor-pointer' />
                        <span className='text-[#07a4ff]'>Liked</span>
                    </div>}
                    <div className='flex justify-center items-center gap-1 text-[18px] cursor-pointer' onClick={()=>{setshowcomments(!showcomments)}}>
                        <FaRegCommentDots className='text-[#1ebbff] w-6 h-5' />
                        <span>comment</span>
                    </div>
                </div>
              { showcomments && <div>
                    <form onSubmit={commenthandler} className='w-full flex justify-between items-center border-b-2 border-b-gray-500 p-2'>
                        <input type="text" onChange={(e) => { setcommentContent(e.target.value) }} value={commentContent} placeholder='leave a comment' className='outline-none border-none w-[90%]' />
                        <button>  <LuSendHorizontal className='text-blue-500 w-6 h-6 mr-2' /></button>
                    </form>
                    <div className='flex flex-col gap-5'>
                        {
                            comments.map((com, index) => {
                                return <div key={index} className='flex flex-col gap-5 border-b-2 border-b-gray-300 p-5'>
                                    <div className='w-full flex justify-start items-center gap-3'>
                                        <div className='w-[50px] h-[50px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer'>
                                            <img src={com.user.profileImage || profile} className='w-full' />
                                        </div>
                                        <div>
                                            <div className='text-[16px] font-semibold capitalize'>{`${com.user.firstname} ${com.user.lastname}`}</div>
                                            <div>{moment(com.createdAt).fromNow()}</div>
                                        </div>
                                    </div>
                                    <div className='pl-12'>{com.content}</div>
                                </div>
                            })
                        }
                    </div>

                </div>}
            </div>

        </div>
    )
}

export default Post