import { Helper } from '../../helpers';
import { OTPSchema, UserSchema } from '../../schema';
import * as Interfaces from '../../interfaces'
import { Op } from 'sequelize';
const { Utilities, ResMsg,Twilio } = Helper

class OPTModel {

    /**
    * @api verifyOTPType
    * @param data - Object containing otp and source EMAIL/MOBILE properties.
    * @param userData - Object containing user-related information.
    * @returns { success: true, message: 'OTP verified successfully' } | { success: false, error: 'Error message' }
    */
    public async verifyOTP(data: Interfaces.OTPInterface.OTPVerifyInterface) {
        const { token, otp } = data;
        const currentTimestamp = new Date().getTime(); // Get current timestamp
        const isOTPValid = await Utilities.decryptOTPToken(token);
        
        console.log("isOtpvalid",isOTPValid)
        if (!isOTPValid) throw "Token decryption failed"
        const phoneNumber = isOTPValid.phoneNumber;
        const user_id = isOTPValid.existingUser;
    
        // Check if the OTP record exists and is valid
        const otpRecord = await OTPSchema.Read.findOne({
            where: {
                user_id: user_id,
                is_used: false,
                expiration_time: { [Op.gt]: currentTimestamp }         
            }
        });
        if (!otpRecord) throw `OTP is invalid or expired - Try Again`;
        const decryptOTP = await Utilities.bycryptCompare(otp.toString(),otpRecord.otp_code)
    
        // Check if the provided token matches the token stored in the OTP record
        if (otpRecord.token !== token) {
            throw "Token verification failed";
        }
    
        // If both OTP and token are valid, update the OTP record and mark it as used
        if (decryptOTP) {
        await otpRecord.update({ is_used: true });
        // await UserSchema.write.update({ is_verified: true }, { where: { id: otpRecord.user_id } });
        const newToken = Utilities.generateOTPToken(phoneNumber, user_id).token;
        return { success: true, message: 'OTP verified successfully', token: newToken };
        }
        else {
            throw `${otp} OTP verification failed`
        }
    }
    


    /**
     * @api sendOTP
     * @param data - Object containing otp and type properties.
     * @param userData - Object containing user-related information.
     * @returns { success: true, message: 'OTP sent successfully' } | { success: false, error: 'Error message' }
    */
    public async sendOTP(data: Interfaces.OTPInterface.OTPRequestInterface) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // let user: any = userData
    
        const { email, phoneNumber } = data
        const source = email ?? phoneNumber;
        const sourceType = !isNaN(Number(source)) ? "MOBILE" : "EMAIL";
        if (!source) throw 'Email or Mobile is required'
        await this.checkUserExist(source);
        if(phoneNumber !== undefined)
        return await this.generateAndsendOTP(phoneNumber,sourceType,source)
    }

    /**
     * @function generateOTP
     * @param data - digit OTP must be 4, 6.
     * 
     * @returns OTP number 
     */
    public async generateOTP(digit: number) {
        const digitOTP = digit === 4 ? 4 : 6
        const min = Math.pow(10, digitOTP - 1);
        const max = Math.pow(10, digitOTP) - 1;
        const OTP = await Utilities.OTPgenerate(min, max);
        return OTP;
    }

    /**
    * @function checkUserExist
    * @param source
    * @returns user
    */
    public async checkUserExist(source: string) {
        // Check if the email already exists
    
        
        const existingUser = await UserSchema.Read.findOne({ where: { phoneNumber:source} });
        if (!existingUser?.id) {
            throw ResMsg.errors.USER_NOT_FOUND
        }
        return existingUser;
    }



    /**
     * @api generateAndsendOTP
     * @param email/phone
     * @returns { success: true, message:  'OTP generated and written successfully' } | { success: false, error: 'Error message' }
     */
    public async generateAndsendOTP(phoneNumber: string,sourceType: string,source:string) {
        // Generate OTP
        // Define a min and max based on the number of digits requested
        const digitOTP =  4 
        const OTP = await this.generateOTP(digitOTP);
        const EncryptOTP = Utilities.bycryptHash(OTP.toString())
        Twilio.sendMessage({ to: source, otp: OTP })
        const existinguser = await UserSchema.Read.findOne({ where: { phoneNumber } });
        console.log("existingUser",existinguser?.id)
        if (!existinguser?.id) { 
            throw ResMsg.errors.EMAIL_NOT_EXIST
        }
        const Token = Utilities.generateOTPToken(phoneNumber,existinguser?.id?.toString())
        // console.log("token hai",Token)
        // Calculate expiration time (e.g., 15 minutes from now)
        const expiration_time = new Date();
        expiration_time.setMinutes(expiration_time.getMinutes() + 15);
        const expirationTimestamp = expiration_time.getTime(); // Convert to timestamp
  
        // Check if the email already exists
        const existingUser = await UserSchema.Read.findOne({ where: { phoneNumber } });
        console.log('ttt',existingUser?.id)
        console.log("existingUser",existingUser?.id)
        if (!existingUser?.id) {
            throw ResMsg.errors.EMAIL_NOT_EXIST
        }
   
        // Prepare data
        const data = {
            user_id: existingUser?.id, 
            type : sourceType ,
            otp_code: await EncryptOTP,  
            expiration_time: expirationTimestamp,
            token : Token.token,
            is_used: false // Assuming OTP is initially unused
        };

        console.log("data of otpschema",data)
        // check if data exists in OTPSchema 
        const checkOtpExist = await OTPSchema.Read.findOne({ where: { user_id: existingUser.id} });
        if (checkOtpExist) {
            // Check if the USER already exists or not
            OTPSchema.Write.update(data, { where: { user_id: existingUser.id} });
        } else if (existingUser?.id) {       
            // Write data to OTPSchema 
            await OTPSchema.Write.create(data);
        }

        return { success: true, message: 'OTP generated and written successfully',Token};
    }
    
} 
 
export default new OPTModel()
   