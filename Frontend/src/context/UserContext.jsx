import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthDataContext } from './AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client';
 export const UserDataContext = createContext() 
export let socket = io('https://linkdlclone.onrender.com')
const UserContext = ({children}) => {
   const {ServerUrl} =  useContext(AuthDataContext)
   const [userData, setUserData] = useState(null)
   const [edit, setEdit] = useState(false)
   const [postData, setpostData] = useState([])
   const [profileData, setprofileData] = useState([])
   const navigate = useNavigate()
   const getcurrentUser = async()=>{
    try {
        // console.log('server url is:',ServerUrl)
        const response = await axios.get(ServerUrl+'/api/user/currentuser',{
            withCredentials: true
        })
        //  console.log('response is :',response)
         setUserData(response.data)   

    } catch (error) {
        console.error('error is',error.response.data)
    }    
   }

   const handleGetProfile=async(userName)=>{
          try {
            console.log(userName)
            let result = await axios.get(ServerUrl+`/api/user/profile/${userName}`,{withCredentials:true})
            console.log(result.data)
            setprofileData(result.data) 
            navigate('/profile')
          } catch (error) {
            console.log(error)
          }

   }

   const getPost =async()=>{
    try {
      console.log('get post is executing')
      const result= await axios.get(ServerUrl+'/api/post/getpost',  {withCredentials: true})
      setpostData(result.data)
      console.log(result)
    } catch (error) {
      if (error.response) {
        console.error('Response error:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }

   }
   const value = {
    userData, setUserData,edit,setEdit,postData,setpostData, getPost,handleGetProfile, profileData, setprofileData
 }

   useEffect(() => {
     getcurrentUser()
     getPost()
   }, [])
   

  return (
   <>
        <UserDataContext.Provider value={ value}>
         {children}
        </UserDataContext.Provider>
        </>
  )
}

export default UserContext