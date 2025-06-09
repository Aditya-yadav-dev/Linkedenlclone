import React, { useContext, useState, useEffect } from 'react'
import logo2 from '../assets/logo2.png'
import { IoSearchSharp } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { useNavigate} from 'react-router-dom'
import axios from 'axios';
import { IoMdContacts } from "react-icons/io";
import { IoMdNotifications } from "react-icons/io";
import profile from '../assets/profile.png';
import { AuthDataContext } from '../context/AuthContext';
import {UserDataContext} from '../context/UserContext';
const Navbar = () => {
    const [activesearch, setactivesearch] = useState(false)
    const {userData, setUserData, handleGetProfile}=useContext(UserDataContext)
    const [showPopUp, setshowPopUp] = useState(false)
   const [searchInp, setsearchInp] = useState('')
 const {ServerUrl} = useContext(AuthDataContext)
  const [searchData, setsearchData] = useState([])
 const navigate = useNavigate();
  const handleSignOut = async()=>{
    try {
        const response = await axios.post(ServerUrl+'/api/auth/logout',{withCredentials:true})
        // console.log('response is :',response.data)
        setUserData(null)
        navigate('/login')
    } catch (error) {
        setsearchData([])
        console.log('error is:',error.message)
    }

  }

  const handleSearch = async()=>{
        try {
           
            let result = await axios.get(`${ServerUrl}/api/user/search?query=${searchInp}`,{withCredentials:true}) 
            console.log(result.data)
            setsearchData(result.data)
        } catch (error) {
            console.log(error)
        }
  }

  useEffect(() => {
      if(searchInp){
        handleSearch()   
      }else{
        setsearchData([])
      }
      
  }, [searchInp])
  

    return (
        <>
            <div className='bg-white w-full h-[80px] fixed top-0 left-0 shadow-lg flex z-[1] items-center p-3 justify-between md:justify-around'>
                <div className='flex justify-center items-center gap-2 '>
                    <div onClick={()=>{navigate('/')}}>
                        <img src={logo2} className='w-[52px]' onClick={() => { setactivesearch(false) }} />
                    </div>
                    {!activesearch && <div> <IoSearchSharp className='w-[25px] h-[25px] text-gray-700 lg:hidden' onClick={() => { setactivesearch(true) }} /></div>}
               { searchData.length >0 &&    
                    <div className='absolute top-[90px] min-h-[100px] h-[500px] overflow-auto left-0 w-full lg:w-[700px] p-5 bg-white lg:left-[20px] shadow-lg flex flex-col gap-4'>
                        {
                            searchData.map((sea, index)=>{
                                return <div onClick={()=>{handleGetProfile(sea.username)}} key={index} className='flex gap-5 items-center cursor-pointer hover:bg-gray-200  rounded-lg border-b-2 border-b-gray-300 p-[8px]'>
                                    <div className='w-[50px] h-[50px] rounded-full overflow-hidden shadow-2xl' > 
                                       <img src={sea.profileImage || profile} className='w-full' />
                                     </div>
                                 <div>
                                     <div className='text-[17px] font-[600] text-gray-700 capitalize'>
                                        {sea.firstname} {sea.lastname}
                                      </div>
                                      <div className='text-[15px] font-semibold text-gray-700'>
                                      {sea.headline}
                                      </div>
                                 </div>
                                     
                                </div>
                            })
                        }
                          




                    </div>
                }


                    <form className={`w-[200px] lg:w-[350px] h-[40px] bg-[#eeece2] lg:flex items-center gap-[10px] py-[5px] px-[6px] rounded-md ${!activesearch ? "hidden" : "flex"}`}>
                        <div>
                            <IoSearchSharp className='w-[25px] h-[25px] text-gray-700' />
                        </div>
                        <input type="text" onChange={(e)=>{setsearchInp(e.target.value)}} value={searchInp} className='w-[80%] h-full bg-transparent border-none outline-none' placeholder='Search users...' />
                    </form>
                </div>
                <div className='flex items-center md:justify-evenly justify-end md:gap-[40px] gap-[24px] relative'>
         { showPopUp &&
                         <div className='absolute w-[300px] rounded-lg min-h-[300px] bg-white shadow-lg right-1 py-4 top-[76px] flex flex-col items-center justify-center gap-[18px]'>
                         <div className='w-[70px] h-[70px] rounded-full overflow-hidden shadow-2xl' > 
                            <img src={userData.profileImage || profile} className='w-full' />
                         </div>
                         <div className='text-[19px] font-[600] text-gray-700 capitalize'>
                           {userData.firstname} {userData.lastname}
                         </div>
                         <button onClick={()=>{handleGetProfile(userData.username)}} className='capitalize w-[90%] border-2 h-[42px] border-[#2dc0ff] text-[#2dc0ff] rounded-full'>view profile</button>
                         <div className='w-[99%] h-[2px] rounded-full bg-[#2dc0ff]'></div>
                         <div onClick={()=>{ navigate('/network')}} className='flex justify-start items-center gap-2 text-lg capitalize w-[95%] cursor-pointer'><IoMdContacts className='text-[23px] text-gray-600' /><span >My Network</span></div>
                         <button onClick={handleSignOut} className='capitalize w-[90%] border-2 h-[42px] border-[#ca3940] text-[#2dc0ff] rounded-full' >sign out</button>

                         </div>
         }

                    <div onClick={()=>{ navigate('/')}} className='lg:flex flex-col justify-center items-center text-lg hidden cursor-pointer'> <AiFillHome className='text-[23px] text-gray-600 cursor-pointer' /> <span >Home</span></div>
                    <div onClick={()=>{ navigate('/network')}}  className='md:flex flex-col justify-center items-center text-lg hidden cursor-pointer'><IoMdContacts className='text-[23px] text-gray-600' /><span >My Network</span></div>
                    <div onClick={()=>{navigate('/notification')}} className='flex flex-col justify-center items-center text-lg  cursor-pointer'><IoMdNotifications className='text-[23px] text-gray-600 cursor-pointer' /><span className='md:block hidden'>Notifications</span></div>
                    <div onClick={()=>{setshowPopUp(!showPopUp)}} className='w-[50px] h-[50px] rounded-full overflow-hidden shadow-2xl cursor-pointer' > <img src={userData.profileImage || profile} className='w-full' /></div>
                </div>
            </div>
        </>
    )
}

export default Navbar;