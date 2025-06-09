import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import {UserDataContext} from './context/UserContext'
import Network from './pages/Network'
import Profile from './pages/Profile'
import Notification from './pages/Notification'
const App = () => {
    const  {userData, setUserData }= useContext(UserDataContext)
  return (
   <Routes>
    <Route path='/' element={userData? <Home /> : <Navigate to='/login' />} />
    <Route path='/login' element={userData? <Navigate to='/' />:<Login /> }  />
    <Route path='/signup' element={userData?<Navigate to='/' />:<Signup />} />
    <Route path='/network' element={userData? <Network />: <Navigate to='/login' />} />
    <Route path='/profile' element={userData? <Profile />: <Navigate to='/login' />} />
    <Route path='/notification' element={userData? <Notification />: <Navigate to='/login' />} />
   </Routes>
  )
}

export default App