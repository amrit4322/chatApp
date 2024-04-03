import { Request, Response } from "express";
import ContactService from "./contact.service";
import { ContactInterface ,IExpressRequest} from "../../interfaces";
import { Helper} from "../../helpers";
// import { IExpressRequest } from "../../interfaces/controller.interface";
const {Response :HelperResponse,ResMsg,Logger} = Helper;

class ContactController{
    public async fetchAll(req:Request,res:Response){
        try{
            const result = await ContactService.fetchAll();
            return HelperResponse.sendSuccess(res, HelperResponse.createResponse(200, "Fetch successful..!!", { result }));
        }catch(error:any){
            Logger.createLog('error', 'error in fetching ', error);
            return HelperResponse.sendError(res, { message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG });
        }
    }
    public async fetchUser(req:IExpressRequest,res:Response){
        try{
            const user = req.user;
            if(!user ) throw new Error("Error occured in user")
            const result = await ContactService.fetchWithEmail(user);
            console.log("fetch user contact")
            return HelperResponse.sendSuccess(res, HelperResponse.createResponse(200, "Fetched user successful..!!", { result }));
        }catch(error:any){
            Logger.createLog('error', 'error in fetching ', error);
            return HelperResponse.sendError(res, { message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG });
        }
    }

    public async newContacts(req:IExpressRequest,res:Response){
        try{
            const user = req.user;
            if(!user ) throw new Error("Error occured in user")
            const result = await ContactService.newContacts(user);
            return HelperResponse.sendSuccess(res, HelperResponse.createResponse(200, "Fetched user successful..!!", { result }));
        }catch(error:any){
            Logger.createLog('error', 'error in fetching ', error);
            return HelperResponse.sendError(res, { message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG });
        }
    }

    public async connect(req:IExpressRequest,res:Response){
        try{
            const user = req.user;
            if(!user ) throw new Error("Error occured in user")
            console.log("respmfpnefosrn",req.body)
            const { senderEmail} = req.body;
            const result = await ContactService.connect( senderEmail,user.email,);
            return HelperResponse.sendSuccess(res, HelperResponse.createResponse(200, "Fetched user successful..!!", { result }));
        }catch(error:any){
            Logger.createLog('error', 'error in fetching ', error);
            return HelperResponse.sendError(res, { message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG });
        }
    }
    public async inviteUser(req:IExpressRequest,res:Response){
        try{
            const user = req.user;
            if(!user ) throw new Error("Error occured in user")
            const { text,emails} = req.body;
            const result = await ContactService.invitePeople(text,emails,user.id);
            return HelperResponse.sendSuccess(res, HelperResponse.createResponse(200, "Fetched user successful..!!", { result }));
        }catch(error:any){
            Logger.createLog('error', 'error in fetching ', error);
            return HelperResponse.sendError(res, { message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG });
        }
    }

    public async allInvites(req:IExpressRequest,res:Response){
        try{
            const user = req.user;
            if(!user ) throw new Error("Error occured in user")
            const result = await ContactService.fetchInvite(user.id);
            return HelperResponse.sendSuccess(res, HelperResponse.createResponse(200, "Fetched user successful..!!", { result }));
        }catch(error:any){
            Logger.createLog('error', 'error in fetching ', error);
            return HelperResponse.sendError(res, { message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG });
        }
    }


    public async remove(req:IExpressRequest,res:Response){
        try{
            const user = req.user;
            if(!user ) throw new Error("Error occured in user")
            const { receiverEmail} = req.body;
            const result = await ContactService.removeConnect(user.email, receiverEmail);
            return HelperResponse.sendSuccess(res, HelperResponse.createResponse(200, "Fetched user successful..!!", { result }));
        }catch(error:any){
            Logger.createLog('error', 'error in fetching ', error);
            return HelperResponse.sendError(res, { message: String(error) || ResMsg.errors.SOMETHING_WENT_WRONG });
        }
    }

}

export default new ContactController();