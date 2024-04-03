import { Router } from 'express'; // Import Request and Response from express
import { ControllerInterface } from '../../interfaces'; // Correct import
import { validateSchema, conditionalTokenValidation,  } from '../../middleware';
import OtpController from './otp.controller';
import { Helper } from '../../helpers';
const {validator} = Helper

class OTPRoutes implements ControllerInterface {
  public path = '/otp';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    const {OTPValidator} = validator;

    this.router
      .all(`${this.path}/*`)
      .post(`${this.path}/send-otp`, validateSchema(OTPValidator.sendOTP), OtpController.sendOtp)
      .post(`${this.path}/verify-otp`, validateSchema(OTPValidator.verifyOTP), OtpController.verifyOTP)

    }
}



export default new OTPRoutes();
