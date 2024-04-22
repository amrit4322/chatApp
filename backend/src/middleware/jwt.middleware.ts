import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { CryptoJSEncKey, JWT, } from '../config/config';
import { IExpressRequest } from '../interfaces/controller.interface';
import consoleHelper from '../helpers/common/console.helper';
import * as CryptoJS from 'crypto-js';
import { Helper } from '../helpers';

const { Response: HelperResponse, ResMsg } = Helper;
 
// Define an interface for your payload data
interface EncryptedPayload {
    data: string; // Assuming 'data' is a string in the payload
    // Add other properties if needed
}

// Your custom middleware to conditionally apply validateToken based on a header
export const conditionalTokenValidation = (req: IExpressRequest, res: express.Response, next: express.NextFunction) => {
    const headerValue = req.headers['api-access-token']; // Replace with the actual header name

    if (headerValue) {
        // Header is present, apply validateToken
        validateToken(req, res, next);
    } else {
        // Header is not present, skip validateToken and continue to the next middleware
        next();
    }
};  

async function decodeJwt(jwtToken: string, res: express.Response): Promise<EncryptedPayload | Error> {
    try {
        const secret: string = JWT.secret; // Define your secret here
        if (secret) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const decoded: any = jwt.verify(jwtToken, secret, { algorithms: ['HS256'] });
            // console.log("check jwt",decoded)

            // Check if the token has expired
            const currentTimestamp = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
            if (decoded.exp && decoded.exp < currentTimestamp) {
                throw res.status(403).json({ message: 'Token has expired' });
            }

            if (decoded.data) {
                const encryptedPayload = decoded.data as string;
                // Decrypt the payload using the RSA private key
                const decryptedPayload = CryptoJS.AES.decrypt(encryptedPayload, CryptoJSEncKey).toString(CryptoJS.enc.Utf8);
                const payloadData = JSON.parse(decryptedPayload);

                return payloadData as EncryptedPayload;
            } else {
                throw new Error("JWT does not contain 'data' property.");
            }
        }
        throw new Error("Secret key is missing.");
    } catch (error) {
        return error as Error;
    }
}


// A middleware function that validates the token
const validateToken = (req: IExpressRequest, res: express.Response, next: express.NextFunction) => {
    // Get the token from the header or body
    const jwtToken = req.headers['api-access-token'] ?? req.body.apiAccessToken;

    // If no token is provided, return an error
    if (!jwtToken) {
        return res.status(401).json({ message: 'No token provided' });
    }
    // console.log("check jwtToken",jwtToken)
    // Verify and decodeJwt
    decodeJwt(jwtToken, res).then(decodedPayload => {
        if (decodedPayload instanceof Error) {
            throw HelperResponse.sendError(res, {
                message: String(decodedPayload.message) || ResMsg.errors.SOMETHING_WENT_WRONG,
              });
            // throw res.status(403).json({ message: 'invalid JWT token', error: decodedPayload.message });
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const decodedPayloadData: any = decodedPayload

            if (decodedPayloadData?.id) {

                req.user = decodedPayloadData;
                next()
            } else {
                throw res.status(401).json({ message: 'Un-authenticated', });
            }
        }
    })
        .catch((err) => {
            consoleHelper.error("ERROR in JWT Authentication");
       
        });
};

export default validateToken;