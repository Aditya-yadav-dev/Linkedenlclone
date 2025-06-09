import React,{useState,useEffect,useContext} from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { AuthDataContext } from '../context/AuthContext'
import {IoIosCheckmarkCircleOutline} from "react-icons/io";
import {RxCrossCircled} from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
const Network = () => {
   const navigate = useNavigate()
   const [connections, setconnections] = useState([])
   const {ServerUrl} = useContext(AuthDataContext)
     const handleGetRequest = async()=>{
        try {
            let result = await axios.get(`${ServerUrl}/api/connection/requests`,{withCredentials: true})
            console.log('result is :',result)
            setconnections(result.data)
        } catch (error) {
            console.log(error)
        }
     }

     const handleAcceptConnection = async(requestId)=>{
            try {
              let result = await axios.put(`${ServerUrl}/api/connection/accept/${requestId}`,{},{withCredentials: true})
              console.log('result is :',result)
              setconnections(connections.filter((con)=>con._id==requestId))
              navigate('/')

            } catch (error) {
              console.log(error)
            }
     }

     const handleRejectConnection = async(requestId)=>{
            try {
              let result = await axios.put(`${ServerUrl}/api/connection/reject/${requestId}`,{},{withCredentials: true})
              console.log('result is :',result)
              setconnections(connections.filter((con)=>con._id==requestId))
              navigate('/')
              
            } catch (error) {
              console.log(error)
            }
     }

 useEffect(() => {
     handleGetRequest()
 }, [])
 

  return (
    <div className='w-screen h-screen bg-[#f0efe7] flex flex-col gap-2 pt-[100px] px-3 items-center'>
        <Navbar />
        <div className='w-full h-[90px] bg-white shadow-lg rounded-lg flex items-center p-2 text-[20px] text-gray-600'>
          Inivitations {connections.length }
        </div>
        {connections.length > 0 &&  
        <div className='w-[100%] shadow-lg rounded-lg flex flex-col gap-5 min-h-[100px] max-w-[900px]'>
          {
            connections.map((connection,index)=>{
             return <div key={index} className='w-full min-h-[100px] p-[20px] flex justify-between items-center'>
                <div className='flex justify-center items-center gap-2'>
                  <div className='w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer'> 
                      <img src={connection.sender.profileImage || profileImage} className='w-full h-full' />
                  </div>
                  <div className='text[19px] font-semibold text-gray-700'>{`${connection.sender.firstname} ${connection.sender.lastname}`}</div>
                </div>
                <div>
             <button className='text-[#18c5ff] font-semibold' onClick={()=>{handleAcceptConnection(connection._id)}} ><IoIosCheckmarkCircleOutline className='w-[40px] h-[40px]' /></button>
             <button className='text-red-600 font-semibold' onClick={()=>{handleRejectConnection(connection._id)}} ><RxCrossCircled className='w-[36px] h-[36px]' /></button>
                </div>
              </div>
            })
          }
        </div> }
    </div>
  )
}

export default Network