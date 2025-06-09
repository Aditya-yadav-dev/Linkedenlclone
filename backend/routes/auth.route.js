import express from 'express'
import { login, logOut, signup } from '../controllers/Auth.controller.js';

const authrouter = express.Router();

authrouter.post('/signup',signup)
authrouter.post('/login',login)
authrouter.post('/logout', logOut)
export default authrouter;