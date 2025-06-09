import React, { useContext, useRef, useState,useEffect } from 'react'
import Navbar from '../components/Navbar'
import profile from '../assets/profile.png'
import { IoCameraReverseOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { BsImage } from "react-icons/bs";
import { UserDataContext } from '../context/UserContext';
import EditProfile from '../components/EditProfile';
import axios, { Axios } from 'axios';
import { AuthDataContext } from '../context/AuthContext';
import Post from '../components/Post';
const Home = () => {
  const { userData, setUserData, edit, setEdit, postData, setpostData, handleGetProfile } = useContext(UserDataContext)
  const [frontendImage, setfrontendImage] = useState('')
  const [backendImage, setbackendImage] = useState('')
  const [description, setdescription] = useState('')
  const [uploadPost, setuploadPost] = useState(false)
  const [posting, setposting] = useState(false)
  const [suggestedUser, setsuggestedUser] = useState([])
  const { ServerUrl } = useContext(AuthDataContext)
  const image = useRef();
  const handleImage = (e) => {
    setfrontendImage(URL.createObjectURL(e.target.files[0]))
    setbackendImage(e.target.files[0])

  }

  const handleUploadPost = async () => {
    try {
      setposting(true)
      let formdata = new FormData();
      if (backendImage) {
        formdata.append('image', backendImage)
      }
      formdata.append('description', description)
      const result = await axios.post(ServerUrl + "/api/post/create", formdata,
        { withCredentials: true }
      )
      setposting(false)
      setuploadPost(false)
    } catch (error) {
      setposting(false)
      if (error.response) {
        console.error('Response error:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }

  }

  const handleSuggestedUser = async () => {
    try {
      let result = await axios(ServerUrl + '/api/user/suggestedUser', { withCredentials: true })
      console.log('suggested users:', result.data)
      setsuggestedUser(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const checksuguser = ()=>{
     handleSuggestedUser()
    console.log('suggested users are :',suggestedUser);
  }


  useEffect(() => {
    handleSuggestedUser()
    console.log('suggested users usestate ', suggestedUser)
  }, [])

  

  return (
    <>
      <div className='w-full min-h-[100vh] bg-[#f0efe7] lg:pt-[100px] flex lg:flex-row justify-center items-start lg:gap-5 gap-3 lg:px-5 px-0 pt-[52px] flex-col'>
        <Navbar />
        {edit && <EditProfile />}
        <div className='w-full lg:w-[25%] bg-white min-h-[200px] shadow-lg rounded-lg p-[8px] relative'>
          <div onClick={() => { setEdit(true) }} className='w-full relative h-[100px] bg-gray-400 rounded-sm overflow-hidden flex items-center justify-center'>
            <img src={userData.coverImage || ''} alt="" className='w-full' />
            <IoCameraReverseOutline className='absolute right-7 text-gray-700 h-7 w-7 top-4 cursor-pointer' />
          </div>
          <div className='w-[65px] h-[65px] rounded-full  shadow-2xl relative top-[-40px] left-[18px] mb-1 z-0 cursor-pointer' >
            <div className='w-full h-full rounded-full overflow-hidden'>
              <img src={userData.profileImage || profile} alt="" className='w-full' />
            </div>
            <div onClick={() => { setEdit(true) }} className='absolute bottom-[10px] z-20 right-[-10px] w-5 h-5 bg-[#17c1ff] rounded-full flex justify-center items-center cursor-pointer'><FaPlus /></div>
          </div>


          <div className='text-[19px] font-[600] text-gray-700 capitalize mt-[-48px] ml-2'>
            <div className='mt-[10px] text-[22px'>
              {userData.firstname} {userData.lastname}
            </div>
            <div className='text-[18px]'>
              {userData.headline || ''}
            </div>
            <div className='text-[16px] font-[550] text-gray-700 capitalize'>
              {userData.location}
            </div>

            <button onClick={() => { setEdit(true) }} className='capitalize w-[94%] my-6 border-2 h-[40px] border-[#2dc0ff] text-[#2dc0ff] rounded-full'>edit profile</button>
          </div>

        </div>

        {uploadPost && <div className='w-full h-full bg-black absolute top-0 z-[100] left-0 opacity-[0.6]'></div>}
        {uploadPost && <div className='w-[85%] max-w-[500px] h-[550px] bg-white shadow-lg flex flex-col justify-self-center justify-start items-start gap-5 rounded-lg p-[20px] absolute top-[100px] left-[35px] lg:left-[500px] z-[200]'>
          <div className='absolute right-7 top-[23px] cursor-pointer' onClick={() => { setuploadPost(false) }}><RxCross2 className='text-gray-600 w-7 font-bold h-7' /></div>
          <div className='flex justify-start items-center gap-2'>
            <div className='w-[70px] h-[70px] rounded-full overflow-hidden cursor-pointer'>
              <img src={userData.profileImage || profile} className='w-full' />
            </div>
            <div className='text-[20px] capitalize'>{userData.firstname} {userData.lastname}</div>
          </div>
          <textarea onChange={(e) => { setdescription(e.target.value) }} value={description} className={`bg-gray-200 rounded-lg w-full ${frontendImage ? 'h-[200px]' : 'h-[550px]'} outline-none p-3 resize-none text-[19px]`} placeholder='what do you want to talk about..?'></textarea>
          <input type="file" ref={image} hidden onChange={handleImage} />
          <div className='w-full flex justify-center overflow-hidden h-[300px] items-center'>
            <img src={frontendImage} name="image" className='h-full' />
          </div>
          <div className='w-full h-[200px] flex flex-col gap-4'>

            <div className='p-[20px] flex items-center justify-start border-b-2 border-gray-500'><BsImage onClick={() => { image.current.click() }} className='w-[24px] h-[24px] cursor-pointer text-gray-500' /></div>
            <div className='flex justify-end'>
              <button onClick={handleUploadPost} disabled={posting} className='w-[102px] h-[42px] text-white bg-blue-600 hover:bg-blue-700 rounded-full'>{posting ? "Posting" : "Post"}</button>
            </div>
          </div>


        </div>}

        <div className='w-full lg:w-[50%]  min-h-[200px] flex flex-col gap-5'>
          <div className='w-full h-[120px] p-5 bg-white rounded-lg shadow-lg flex items-center justify-center gap-[10px]'>
            <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer'>
              <img src={userData.profileImage || profile} />
            </div>
            <button onClick={() => { setuploadPost(true) }} className='w-[80%] h-[60px] border-2 rounded-full border-gray-500 flex items-center justify-start px-[20px] hover:bg-gray-200'>Start a post</button>
          </div>
          {
            postData.map((post, index) => {
              return <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt} />
            })
          }


        </div>

        <div className='w-full lg:w-[25%] bg-white min-h-[200px] p-5 shadow-lg hidden lg:flex flex-col'>
          <h1 onClick={checksuguser} className='text-[20px] text-gray-600 font-semibold'>Suggested Users</h1>
          {suggestedUser.length > 0 && <div className='flex flex-col gap-2'>
            {
              suggestedUser.map((sug, index) => {
                return <div key={index} className='flex items-center gap-2 mt-2 hover:bg-gray-200 cursor-pointer rounded-lg p-1' onClick={()=>{ handleGetProfile(sug.username)}} >
                  <div className='w-[40px] h-[40px] rounded-full overflow-hidden shadow-2xl' >
                    <img src={sug.profileImage || profile} className='w-full' />
                  </div>
                  <div>
                    <div className='text-[16px] font-[600] text-gray-700 capitalize'>
                      {sug.firstname} {sug.lastname} 
                    </div>
                    <div className='text-[13px] font-semibold text-gray-700'>
                      {sug.headline}
                    </div>
                  </div>
                </div>
              })
            }
          </div>}


          {
            suggestedUser.length==0 && <p className='text-[40px] text-black' >There are no suggested users</p>
          }
        </div>

      </div>
    </>
  )
}

export default Home