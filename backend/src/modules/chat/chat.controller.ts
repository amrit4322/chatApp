import { Request, Response } from "express";
import { ChatProcessInterface } from "../../interfaces";
import ChatService from "./chat.service";
import { Helper } from "../../helpers";
import * as InterFace from "../../interfaces";
import upload from "../../config/multer";


const {Response :HelperResponse,ResMsg,Logger} = Helper;

class ChatController{
    public async connect(req:Request,res:Response){
        try{
            const result = await ChatService.fetchAll();
            
            return HelperResponse.sendSuccess(res, HelperResponse.createResponse(200, "Fetch successful..!!", { result }));
        }catch(error:any){
            Logger.createLog('error', 'error in fetching ', error);
            return HelperResponse.sendError(res, { message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG });
        }
    }
    public async uploadMessage(req:Request,res:Response){
        try{
            let data :InterFace.ChatInterface.ChatInterface= req.body;
            let file :any= req.file;
            const result = await ChatService.insertMessageWithFile(data,file);
            
            return HelperResponse.sendSuccess(res, HelperResponse.createResponse(200, "Fetch successful..!!", { result }));
        }catch(error:any){
            Logger.createLog('error', 'error in fetching ', error);
            return HelperResponse.sendError(res, { message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG });
        }
    }

}
export default new ChatController();