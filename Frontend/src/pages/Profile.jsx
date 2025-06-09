import React, { useContext, useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

import profile from '../assets/profile.png'
import { IoCameraReverseOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { BsImage } from "react-icons/bs";
import { UserDataContext } from '../context/UserContext';
import EditProfile from '../components/EditProfile';
import axios from 'axios';
import Post from '../components/Post';
import Connection from '../../../backend/models/connection.model';
import ConnectionButton from '../components/ConnectionButton';
const Profile = () => {
    const { userData, setUserData, edit, setEdit, postData, setpostData, profileData, setprofileData } = useContext(UserDataContext)
  
    const [profilepost, setprofilepost] = useState([])
   
    useEffect(() => {
        setprofilepost(postData.filter((post) => post.author._id === profileData._id))
        console.log(profileData.skills)
    }, [profileData])

    return (
        <div className='w-full min-h-[100vh] bg-[#f0efe7] flex flex-col items-center pt-[100px] pb-[40px]'>
            <Navbar />
            {edit && <EditProfile />}
            <div className='w-full max-w-[900px] min-h-[100vh] flex flex-col gap-2'>

                <div className='relative bg-white pb-[40px] rounded-lg shadow-2xl'>
                    <div onClick={() => { setEdit(true) }} className='w-full relative h-[100px] bg-gray-400 rounded-sm overflow-hidden flex items-center justify-center'>
                        <img src={profileData.coverImage || ''} className='w-full' />
                        <IoCameraReverseOutline className='absolute right-7 text-gray-700 h-7 w-7 top-4 cursor-pointer' />
                    </div>
                    <div className='w-[65px] h-[65px] rounded-full  shadow-2xl relative top-[-40px] left-[18px] mb-1 z-0 cursor-pointer' >
                        <div className='w-full h-full rounded-full overflow-hidden'>
                            <img src={profileData.profileImage || profile} alt="" className='w-full' />
                        </div>
                        <div onClick={() => { setEdit(true) }} className='absolute bottom-[10px] z-20 right-[-10px] w-5 h-5 bg-[#17c1ff] rounded-full flex justify-center items-center cursor-pointer'><FaPlus /></div>
                    </div>


                    <div className='text-[19px] font-[600] text-gray-700 capitalize mt-[-48px] ml-2'>
                        <div className='mt-[10px] text-[22px'>
                            {profileData.firstname} {profileData.lastname}
                        </div>
                        <div className='text-[18px]'>
                            {profileData.headline || ''}
                        </div>
                        <div className='text-[16px] font-[550] text-gray-700 capitalize'>
                            {profileData.location}
                        </div>
                        <div className='text-[16px] font-[550] text-blue-700 capitalize'>
                            {profileData.connection.length} <span>connections</span>
                        </div>
                        {profileData._id == userData._id ? <button onClick={() => { setEdit(true) }} className='capitalize mt-1 min-w-[150px] my-6 border-[3px] h-[40px] border-[#2dc0ff] text-[#2dc0ff] rounded-full'>edit profile</button> : <div className='ml-[20px] mt-[20px]'><ConnectionButton userId={profileData._id} /></div>}
                    </div>

                </div>


                <div className='w-full h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg rounded-lg'>{`Post (${profilepost.length})`}</div>

                {profilepost.map((post, index) => {
                        return <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt} />
                })}

                {profileData.skills.length > 0 && <div className='w-full min-h-[80px] flex items-center p-[20px] gap-2 bg-white shadow-lg rounded-lg'> <div className='text-[22px] text-gray-600 font-semibold'>Skills:</div>
                    <div className='flex flex-wrap justify-start items-center gap-[20px] text-gray-600 vp-[40px]'>
                        {profileData.skills.map((skill,index) => {
                           return <div key={index} className='text-[20px]'><div>{skill}</div></div>
                            
                        })
                        }
                   {profileData._id == userData._id && <button onClick={() => { setEdit(true) }} className='capitalize ml-5 min-w-[150px] my-6 border-[3px] h-[40px] border-[#2dc0ff] text-[#2dc0ff] rounded-full'>Add skills</button> }
                    </div>
                </div>
                }

                {profileData.education.length > 0 && <div className='w-full min-h-[80px] flex items-center p-[20px] gap-2 bg-white shadow-lg rounded-lg'> <div className='text-[22px] text-gray-600 font-semibold'>Education:</div>
                    <div className='flex flex-col justify-start items-start gap-[20px] text-gray-600 p-[40px]'>
                        {profileData.education.map((edu, index) => {
                          return <div key={index}>
                                <div className='text-[20px]'>College: {edu.college}</div>
                                <div className='text-[20px]'>Degree: {edu.degree}</div>
                                <div className='text-[20px]'>Field Of Study: {edu.fieldofstudy}</div>
                            </div>
                        })
                        }
                     {profileData._id == userData._id && <button onClick={() => { setEdit(true) }} className='capitalize ml-5 min-w-[150px] my-6 border-[3px] h-[40px] border-[#2dc0ff] text-[#2dc0ff] rounded-full'>Add Education</button> }
                    </div>
                </div>
                }


                {profileData.experience.length > 0 && <div className='w-full min-h-[80px] flex items-center p-[20px] gap-2 bg-white shadow-lg rounded-lg'> <div className='text-[22px] text-gray-600 font-semibold'>Experience:</div>
                    <div className='flex flex-col justify-start items-start gap-[20px] text-gray-600 p-[40px]'>
                        {profileData.experience.map((exp, index) => {
                           return <div key={index}>
                                <div className='text-[20px]'>Title: {exp.title}</div>
                                <div className='text-[20px]'>Description: {exp.description}</div>
                                <div className='text-[20px]'>Company: {exp.company}</div>
                            </div>
                        })
                        }
                       { profileData._id == userData._id && <button onClick={() => { setEdit(true) }} className='capitalize ml-5 min-w-[150px] my-6 border-[3px] h-[40px] border-[#2dc0ff] text-[#2dc0ff] rounded-full'>Add Experience</button> }
                    </div>
                </div>
                }






            </div>




        </div>

    )
}

export default Profile