import Notification from "../models/notification.model.js"

export const getNotification = async(req,res)=>{
    try {
        
        let notification = await Notification.find({receiver: req.userId})
        .populate("relatedUser","firstname lastname profileImage")
        .populate("relatedPost","image description")
        return res.status(200).json(notification)
        
    } catch (error) {
        return res.status(500).json({messsage:`get notification ${error}`})
        
    }
}


export const deleteNotification = async(req,res)=>{
    try {
         let {id} = req.params;
        await Notification.findByIdAndDelete({
            _id: id,
            receiver: req.userId
        })
        return res.status(200).json({message:"Notification deleted"})
        
    } catch (error) {
        return res.status(500).json({messsage:`delete notification ${error}`})
        
    }
}

export const clearAllNotification = async(req,res)=>{
    try {
        let {id} = req.params;
        await Notification.deleteMany({receiver: req.userId})
       
        return res.status(200).json({message:'all notification deleted'})
        
    } catch (error) {
        return res.status(200).json({messsage:`delete all notification ${error}`})
        
    }
}