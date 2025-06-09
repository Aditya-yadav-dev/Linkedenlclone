import {BrowserRouter }from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import AuthContext from './context/AuthContext'
import UserContext from './context/UserContext'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthContext>
    <UserContext>
    <App />
    </UserContext>
    </AuthContext>
    </BrowserRouter>
 
)
