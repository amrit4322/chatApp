import { Request, Response } from "express";
import { ChatProcessInterface } from "../../interfaces";
import ChatService from "./chat.service";
import { Helper } from "../../helpers";


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

}
export default new ChatController();