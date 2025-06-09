import React,{useState, useContext, useEffect} from 'react'
import { AuthDataContext } from '../context/AuthContext'
import axios from 'axios'
import {io} from 'socket.io-client'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { IoCloudyNight } from 'react-icons/io5'
const ConnectionButton = ({userId}) => {
 
  const navigate =  useNavigate()
 const [status, setstatus] = useState('')
   const {ServerUrl} = useContext(AuthDataContext)
 const {userData} = useContext(UserDataContext)
 let socket = io(ServerUrl)
   const handleSendConnection = async() => { 
       try {
        let result = await axios.post(`${ServerUrl}/api/connection/send/${userId}`,{
         
        },{withCredentials:true})
        console.log(result)
        setstatus(result.data.status)
       } catch (error) {
        console.log(error)
       }
    }

    const handleRemoveConnection = async() => { 
        try {
         let result = await axios.delete(`${ServerUrl}/api/connection/remove/${userId}`,{withCredentials:true})
         console.log(result)
         setstatus(result.data.status)
        
        } catch (error) {
         console.log(error)
        }
     }
 

    const handleGetStatus = async() => { 
        try {
          console.log(ServerUrl)
         let result = await axios.get(`${ServerUrl}/api/connection/getstatus/${userId}`,{withCredentials:true})
         console.log(result)
         setstatus(result.data.status)
        } catch (error) {
         console.log(error)
        }
     }

      useEffect(() => {
         socket.emit("register",userData._id)
         handleGetStatus()
         socket.on("statusUpdate",({updatedUserId, newStatus})=>{
            if(updatedUserId == userId){
            setstatus(newStatus)
            }
         })
         return ()=>{
            socket.off("statusUpdate")
         }
      }, [])
      
        const handleClick = async()=>{
            if(status=="disconnect"){
                await handleRemoveConnection()
            } else if(status == "received"){
                navigate("/network")
            }else{
                await handleSendConnection()
            }
        }


  return (
    <div onClick={handleClick} disabled={status=="pending"}> <button className='capitalize min-w-[100px] border-2 h-[42px] border-[#2dc0ff] text-[#2dc0ff] rounded-full' disabled={status=="pending"}>{status}</button></div>
  )
}

export default ConnectionButton