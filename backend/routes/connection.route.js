import express from 'express'
import { acceptConnection, getConnectionRequest, getConnectionstatus, getUserConnection, rejectConnection, removeConnection, sendConnection } from '../controllers/connection.controller.js';
import isAuth from '../middlewares/isAuth.js'
const connectionRouter = express.Router();

connectionRouter.post('/send/:id',isAuth,sendConnection);
connectionRouter.put('/accept/:connectionId',isAuth,acceptConnection);
connectionRouter.put('/reject/:connectionId',isAuth,rejectConnection);
connectionRouter.get('/getstatus/:userId',isAuth,getConnectionstatus);
connectionRouter.delete('/remove/:userId',isAuth,removeConnection);
connectionRouter.get('/requests',isAuth,getConnectionRequest);
connectionRouter.get('/',isAuth,getUserConnection); 

export default connectionRouter;