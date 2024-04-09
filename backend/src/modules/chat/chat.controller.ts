import { Request, Response } from "express";
import { ChatProcessInterface } from "../../interfaces";
import ChatService from "./chat.service";
import { Helper } from "../../helpers";
import * as InterFace from "../../interfaces";
import upload from "../../config/multer";
import path from "path";



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

    public async download(req:Request,res:Response){
        try{
            const fileName = req.params.name;
            
          
            const directoryPath = path.join(__dirname, "../../uploads/")
            console.log("path is ",directoryPath)
            res.download(directoryPath + fileName, fileName, (err) => {
              if (err) {
                res.status(500).send({
                  message: "Could not download the file. " + err,
                });
              }
            });
          
        }
        catch(error:any){

        }
    }
}
export default new ChatController();