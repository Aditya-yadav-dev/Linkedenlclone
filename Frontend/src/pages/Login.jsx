import React,{useContext, useState} from 'react'
import logo from '../assets/logo.svg'
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AuthDataContext } from '../context/AuthContext'
import { UserDataContext } from '../context/UserContext'
const login = () => {
  const [show, setShow] = useState(false)
  const {userData, setUserData } = useContext(UserDataContext)
  const navigate = useNavigate()
  const {ServerUrl}=  useContext(AuthDataContext)
  const [formdata, setformdata] = useState({
      email:'',
      password:''
  })
const [loading, setloading] = useState(false)
const [error, seterror] = useState('')
  const handlechange=(e)=>{
      setformdata({...formdata,[e.target.name]:e.target.value})
  }

  const handleSignIn= async (e) => { 
      e.preventDefault();
      setloading(true)
      try {
       
        let response = await axios.post(ServerUrl+'/api/auth/login',{
          email: formdata.email,
          password: formdata.password
        },{withCredentials:true}) 
      // console.log('result',response.data)
      setUserData(response.data)
      navigate('/')
      setloading(false)
      setformdata({
          email:'',
          password:''
      })
      } catch (error) {
          setloading(false)
          console.log(error)
          if (error.response) {
              console.log('Error Data:', error.response.data); // backend's message
              console.log('Status Code:', error.response.status); // 400
              seterror(error.response.data.message)
            }
            setTimeout(()=>{
                seterror('')
            },3000)
      }
   

  }

return (
  <div className='w-screen h-screen bg-white flex flex-col justify-center items-center gap-[10px]'>
      <div className='p-[25px] lg:p-[33px] w-full h-20 flex items-start'>
          <img src={logo} alt="" />
      </div>
      <form onSubmit={handleSignIn} className='w-[90%] max-w-[400px] h-[400px] md:shadow-2xl flex flex-col justify-center gap-4 p-4 rounded-xl'>
         <h1 className='text-gray-800 text-3xl font-semibold mb-6'>Sign Up</h1>
         <input type="email" placeholder='email' name='email' value={formdata.email} onChange={handlechange} required className='w-full h-12 border-2 border-gray-600 text-gray-800 text-xl px-[20px] py-[10px] rounded-md' />
         <div className='relative w-full h-12 border-2 border-gray-600 text-gray-800 text-xl rounded-md capitalize'>
         <input type ={show ?"text":"password"} placeholder='password' value={formdata.password} name='password' onChange={handlechange} required className='h-full w-full border-non text-gray-800 text-xl px-[20px] py-[10px] rounded-md' />
         <span className='absolute right-4 top-2 text-[#24b2ff] font-semibold lowercase text-[17px] cursor-pointer' onClick={()=>{setShow(prevVal=>!prevVal)}}>{show?"hidden":"show"}</span>
         </div>
         {error? <p className='text-red-700'>{error}</p>:""}
         <button className='w-full bg-blue-700 rounded-full mt-4 text-white py-2 hover:bg-blue-800 hover:text-[18px] text-[17px] ' disabled={loading}>{loading?"Signing...":"Sign In"}</button>
         <p className='text-center cursor-pointer'>Create new Account ? <span onClick={()=>{ navigate('/signup')}} className='text-blue-900 hover:text-blue-950'>Sign Up</span></p>
         </form>
  </div>
)
}

export default login