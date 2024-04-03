import { Response } from 'express'; // Import Request and Response from express
import { Helper } from '../../helpers';
import OTPModel from './otp.helper';
import { OTPInterface, IExpressRequest } from '../../interfaces';

const { Response: HelperResponse,Logger } = Helper;

class OTPController {
    
     /**
     * @api sendOtp
     * @dev sending OTP To user
     */
     public async sendOtp(req: IExpressRequest, res: Response) {
        const { sendError, sendSuccess } = HelperResponse;
        try {
            // Attempt to parse req.body as OTPRequestInterface
        const data: OTPInterface.OTPRequestInterface = req.body as OTPInterface.OTPRequestInterface;

            const result = await OTPModel.sendOTP(data);
            return sendSuccess(res, { message: `OTP sent successfully.`, result });
        } catch (error) {
            Logger.createLog('error', 'error log in sendOTP', error);
            return sendError(res, { message: String(error) });
        }
    }

    /**
     * @api verifyOTP
     * @dev verify user OTP 
     */
    public async verifyOTP(req: IExpressRequest, res: Response) {
        const { sendError, sendSuccess } = HelperResponse;
        try { console.log("inside verifyOTP")
            const data = req.body
            // eslint-disable-next-line @typescript-eslint/no-explicit-any

            const result = await OTPModel.verifyOTP(data );
            //  generateWalletAddress()
            return sendSuccess(res, { message: `OTP verified successfully.`, result });
        } catch (error) {
            Logger.createLog('error', 'error log in verifyOTP', error);
            return sendError(res, { message: String(error) });
        }
    }
}

export default new OTPController();
