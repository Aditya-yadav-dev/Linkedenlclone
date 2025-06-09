import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import { RxCross2 } from "react-icons/rx";
import { AuthDataContext } from '../context/AuthContext'
import axios from 'axios'
import profile from '../assets/profile.png'

const Notification = () => {
  const { ServerUrl } = useContext(AuthDataContext)
  const [notificationData, setnotificationData] = useState([])

  const handleNotification = async () => {
    try {
      let result = await axios.get(`${ServerUrl}/api/notification/getnotification`, { withCredentials: true })
      setnotificationData(result.data)
      console.log('notification result:', result)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleNotification()
  }, [])

  const handleMesssage = (type) => {
    if (type == "like") {
      return "liked your post"
    } else if (type == "comment") {
      return "commented on your post"
    } else {
      return "Acccept your connection"
    }
  }

  const handledeleteNotification = async (id) => {
    try {
      let result = await axios.delete(`${ServerUrl}/api/notification/deleteonenotification/${id}`, { withCredentials: true })
      await handleNotification()
    } catch (error) {
      console.log(error)
    }
  }

  const handledeleteAllNotification = async () => {
    try {
      let result = await axios.delete(`${ServerUrl}/api/notification/deletemanynotification`, { withCredentials: true })
      await handleNotification()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='w-screen h-screen bg-[#f0efe7] flex flex-col gap-2 pt-[100px] px-3 items-center'>
      <Navbar />
      <div className='w-full h-[90px] bg-white shadow-lg rounded-lg flex items-center p-3 text-[20px] text-gray-600 justify-between'>
        <div>
          Notifications ({notificationData.length})
        </div>
        {notificationData.length > 0 &&
          <button onClick={handledeleteAllNotification} className='min-h-[100px] h-[40px] rounded-full border-[#ec4545] text-[#ec4545]'>clear all</button>
        }
      </div>

      {notificationData.length > 0 &&
        <div className='w-[100%] shadow-lg rounded-lg flex flex-col bg-white gap-5 h-[100vh] p-3 overflow-auto max-w-[900px]'>
          {
            notificationData.map((noti, index) => {
              return <div key={index} className='w-full min-h-[100px] p-10 border-b-2 border-b-gray-200 flex justify-between items-center'>
                <div>
                  <div className='flex justify-center items-center gap-2'>
                    <div className='w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer'>
                      <img src={noti.relatedUser.profileImage || profileImage} className='w-full h-full' />
                    </div>
                    <div className='text[19px] font-semibold text-gray-700'>{`${noti.relatedUser.firstname} ${noti.relatedUser.lastname} ${handleMesssage(noti.type)}`}</div>
                  </div>

                  {noti.relatedPost && <div className='flex items-center gap-3 ml-[80px] h-[70px] overflow-hidden'>
                    <div className='w-[80px] h-[50px] overflow-hidden' >
                      <img src={noti.relatedPost.image || profile} />
                    </div>

                  </div>
                  }
                </div>

                <div onClick={() => { handledeleteNotification(noti._id) }} className='flex justify-center items-center gap-2'>
                  <RxCross2 className='text-gray-600 w-7 font-bold h-7' />
                </div>


              </div>
            })
          }
        </div>}

    </div>
  )
}

export default Notification