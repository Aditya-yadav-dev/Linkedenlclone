import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { clearAllNotification, deleteNotification, getNotification } from "../controllers/notification.controller.js";

let notificationRouter = express.Router()

notificationRouter.get('/getnotification',isAuth,getNotification)
notificationRouter.delete('/deleteonenotification/:id',isAuth,deleteNotification)
notificationRouter.delete('/deletemanynotification',isAuth,clearAllNotification)

export default notificationRouter;