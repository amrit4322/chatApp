
import { ResMsg } from "../response/responseMessage";
import bcrypt from 'bcrypt'
import { Helper } from '../index'
import * as APIInterface from '../../interfaces/api.interface';
import { JWT, CryptoJSEncKey, CryptoJSEncTokenKey, } from '../../config/config'
import jwt from "jsonwebtoken";
import  CryptoJS from 'crypto-js'
import * as cryptos from 'crypto';
class Utilities {



    /**
     * @function generateJwt
     * @param jwtData
     * @returns Promise
     */
    public async generateJwt(
        payloadData: APIInterface.JwtPayload
      ): Promise<string> {
        try {
          // Encrypt the payload using AES
          const encryptedPayload = CryptoJS.AES.encrypt(
            JSON.stringify(payloadData),
            CryptoJSEncKey
          ).toString();
    
          // Now, you can create the JWT with the encrypted payload
          const jwtToken = jwt.sign({ data: encryptedPayload }, JWT.secret, {
            algorithm: "HS256",
            issuer: "xrpayment",
            expiresIn: 2 * 24 * 60 * 60,
          });
    
          return jwtToken;
        } catch (error: unknown) {
          throw this.throwError(ResMsg.errors.SOMETHING_WENT_WRONG, "400", {
            error: error,
          });
        }
      }


    /**
    * @function generateRefreshToken
    * @param payloadData
    * @returns Promise
    */
    // public async generateRefreshToken(payloadData: APIInterface.JwtPayload): Promise<string> {
    //     try {
    //         if (JWT?.rt_private_key) {
    //             // Encrypt the payload using RSA-OAEP
    //             const encryptedPayload = jwt.sign(payloadData, JWT.rt_private_key, { algorithm: 'RS256' });
    //             // Now, you can create the JWT with the encrypted payload
    //             const jwtToken = jwt.sign({ data: encryptedPayload }, JWT.rt_private_key, { algorithm: 'RS256', issuer: 'xrpayment', expiresIn: JWT.rt_life });
    //             return jwtToken;
    //         }
    //         throw new Error("JWTSECRET environment variable is not defined.");
    //     } catch (error: unknown) {
    //         throw this.throwError(ResMsg.errors.SOMETHING_WENT_WRONG, "400", { error: error });
    //     }
    // }


    /**
>>>>>>> bdd59bd0fe90e83fa8d3ef7e2fd2305e53d9e17a
     * @function bycryptHash
     * @param password
     * @returns passwordHash
     */
    public bycryptHash = async (password: string): Promise<string> => {
        const saltRounds = 10;
        return new Promise<string>((resolve) => {
            bcrypt.hash(password, saltRounds, function (err: unknown, hash: string) {
                if (err) {
                    const { Utilities, ResMsg } = Helper
                    // Handle the error (e.g., log it or return an error response)
                    throw Utilities.throwError(ResMsg.errors.SOMETHING_WENT_WRONG, "400", { error: err });
                } else {
                    // Resolve with the 'hash'
                    resolve(hash);
                }
            });
        });
    };

    /**

    * @function throwError
    * @param message
    * @param status
    * @param errors
    * @returns
    */
    public throwError(message: string, status: string, errors: object = { status: '' }) {
        // Create a custom error object
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const customError: any = new Error(message); // Use 'any' if you want to add custom properties to the error

        // Add custom properties to the error
        customError.status = status;
        customError.errors = errors;

        // Throw the custom error
        throw customError;
    }

    /**
    * @function passwordComplexityCheck
    * @param data
    * @returns boolen
    */
    public passwordComplexityCheck(password: string) {
        if (
            password.length < 6 || // Minimum length of 6 characters
            !/[A-Z]/.test(password) || // At least one uppercase letter
            !/[a-z]/.test(password) || // At least one lowercase letter
            !/\d/.test(password) || // At least one number
            !/[!@#$%^&*,.]/.test(password) // At least one special character
        ) {
            throw this.throwError(ResMsg.errors.PASSWORD_COMPLEXITY, "400", {});
        }
        else return true;
    }
    /**
  * @function bycryptCompare
  * @param password
  * @returns passwordHash
  */

    public async bycryptCompare(inputPassword: string, storedHashedPassword: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            bcrypt.compare(inputPassword, storedHashedPassword, function (err: unknown, result: boolean) {
                const { Utilities, ResMsg } = Helper
                if (err) {
                    // Handle the error (e.g., log it or return an error response)
                    //   reject(err);
                    throw Utilities.throwError(ResMsg.errors.SOMETHING_WENT_WRONG, "400", { error: err });

                } else if (result === true) {
                    // Passwords match; the user is authenticated
                    resolve(true);
                }
                else {
                    // Passwords don't match; the user provided an incorrect password
                    resolve(false);
                }
            });
        });
    }


    /**
     * @function OTPgenerate
     * @param limit
     * @returns
     */
    public async OTPgenerate(min: number = 100000, max: number = 999999): Promise<number> {

      // Minimum , Maximum 6-digit number
      return cryptos.randomInt(min, max);
  }
  


   

    // Function to check if `lastUpdated` is more than 30 minutes ago
    public isLastUpdatedMoreThan30MinutesAgo = (lastUpdated: Date) => {
        const thirtyMinutesInMillis = 30 * 60 * 1000; // 30 minutes in milliseconds
        const currentTime = new Date().getTime();
        return currentTime - new Date(lastUpdated).getTime() > thirtyMinutesInMillis;
    }


    /**
    * @function generateOTPToken temp token
    * @param email
    * @returns { token, expiration } 
    */

    
public generateOTPToken(phoneNumber: string 
  , existingUser: string ): { token: string; expiration: number } {
  const timestamp: number = Date.now();    
  // Handling undefined values
  const data: string = `${phoneNumber}:${timestamp}:${existingUser}`;
//   console.log("data is of token",data)
  // Encrypting data to generate token
  const cipherText = CryptoJS.AES.encrypt(data, CryptoJSEncTokenKey);
  const token: string = cipherText.toString();
//   console.log("token is",token)
  // Assuming expiration time as 1 minute from now
  const expiration: number = timestamp + (10 * 60 * 1000); // 1 minute in milliseconds
  return { token, expiration };   
}
  
  
    /**
     * @function decryptOTPToken 
     * @param token
     * @returns { email, error }
     */
    public decryptOTPToken(token: string): { phoneNumber: string; existingUser: string ; errorMessage: string | null } {
      try {
        // console.log("token",token)
          const bytes = CryptoJS.AES.decrypt(token, CryptoJSEncTokenKey);
        //   console.log(bytes)
          const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        //   console.log("bawa",decryptedData)
  
          if (!decryptedData) {
              return { phoneNumber: '', existingUser: '', errorMessage: 'Token decryption failed' };
          }
     
          const [phoneNumber, timestamp, existingUser] = decryptedData.split(':');
          const tokenTimestamp = parseInt(timestamp, 10); 
     
          // Check if the token has expired (1 minute expiration time)
          const currentTimestamp = Date.now();  
          if (currentTimestamp > tokenTimestamp + 10 * 60 * 1000) {
              return { phoneNumber: '', existingUser: '', errorMessage: 'Session has expired. Please try again.' };
          }
  
          return { phoneNumber, existingUser, errorMessage: null };
      } catch (error) {
          return { phoneNumber: '', existingUser: '', errorMessage: 'Invalid token. Please try again.' };
      }
  }
  





    // public generateOTPToken(email: string | undefined): { token: string; expiration: number } {
    //     const timestamp: number = Date.now();
    //     const data: string = `${email}:${timestamp}`;
    //     const cipherText = CryptoJS.AES.encrypt(data, CryptoJSEncTokenKey);
    //     const token = cipherText.toString();
    //     // You can add an expiration timestamp to the token (1 minute in milliseconds)
    //     const expiration: number = timestamp + 60 * 1000;
    //     return { token, expiration };
    // }



 

    /**
     * Encrypts the payload data using AES encryption.
     * @param {string} payloadData - The data to be encrypted.
     * @returns {string} - The encrypted payload as a string.
     */
    // public encryptData(payloadData: string) {
    //     // Perform AES encryption using CryptoJS
    //     const encryptedPayload = CryptoJS.AES.encrypt(payloadData, BitGoConf.EncKey).toString();

    //     // Return the encrypted payload
    //     return encryptedPayload;
    // }

    /**
     * Decrypts the encrypted payload using AES decryption.
     * @param {string} encryptedPayload - The encrypted data to be decrypted.
     * @returns {string} - The decrypted payload as a string.
     */
    // public decryptData(encryptedPayload: string) {
    //     // Perform AES decryption using CryptoJS
    //     const decryptedPayload = CryptoJS.AES.decrypt(encryptedPayload, BitGoConf.EncKey).toString(CryptoJS.enc.Utf8);

    //     // Return the decrypted payload
    //     return decryptedPayload;
    // }


    public formatDecimalString(inputString: string) {
        // Use regex to extract the first 4 decimal places after the decimal point
        const result = inputString.match(/(\d+\.\d{5})/);

        // Check if there is a match and get the result
        const formattedResult = result ? result[1] : null;

        // Check if there are less than 4 or no decimal places
        if (!formattedResult || formattedResult.length === inputString.length) {
            return inputString; // Return the original string
        } else {
            return formattedResult; // Return the formatted result
        }
    }


    public getNextyearDate() {
        const oneYearFromNow = new Date();
        return oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    }


    public getYesterdayDate() {
        const today = new Date();

        // Get the milliseconds for one day
        const oneDayMilliseconds = 24 * 60 * 60 * 1000;

        // Calculate milliseconds for yesterday
        const yesterdayMilliseconds = today.getTime() - oneDayMilliseconds;

        // Create a new Date object for yesterday
        const yesterdayDate = new Date(yesterdayMilliseconds);

        // Set hours, minutes, seconds, and milliseconds to 0
        yesterdayDate.setHours(0, 0, 0, 0);

        return yesterdayDate
    }


    public getTommorowDate() {
        // Create a new Date object for today
    const today = new Date();

    // Get the milliseconds for one day
    const oneDayMilliseconds = 24 * 60 * 60 * 1000;

    // Calculate milliseconds for tomorrow
    const tomorrowMilliseconds = today.getTime() + oneDayMilliseconds;

    // Create a new Date object for tomorrow
    const tomorrowDate = new Date(tomorrowMilliseconds);

    tomorrowDate.setHours(0, 0, 0, 0);

    return tomorrowDate
    
    }

    public getDestinationTag(inputString : string) {
        // Find the index of the '?' character
        let index = inputString.indexOf('?');

        // Extract the substring after the '?' character
        let valueAfterQuestionMark;
        if (index !== -1) { // '?' found
            return valueAfterQuestionMark = inputString.substring(index + 1);
        } else {
            return valueAfterQuestionMark = "null";
        }
    }

}

export default new Utilities();
