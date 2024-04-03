import { JoiInstance, customErrorMessages } from "./joi";

export default class OTPValidator {
    static sendOTP = {
        body: JoiInstance.object().keys({
            phoneNumber: JoiInstance.string().messages({
                'string.base': customErrorMessages.mustBeString,
            }),
            email: JoiInstance.string().email({ tlds: { allow: true } }) // This line prevents top-level domains in the email
                .messages({
                    'string.email': customErrorMessages.email,
                }),
            digit: JoiInstance.number().messages({
                'number.base': customErrorMessages.mustBeNumber,
            }),
        }),
    };

    static verifyOTP = {
        body: JoiInstance.object().keys({
            mobile: JoiInstance.string().messages({
                'string.base': customErrorMessages.mustBeString,
            }),
            email: JoiInstance.string().email({ tlds: { allow: true } }) // This line prevents top-level domains in the email
                .messages({
                    'string.email': customErrorMessages.email,
                }),
                token: JoiInstance.string() // This line prevents top-level domains in the email
                .messages({
                    'string.email': customErrorMessages.email,
                }),
            otp: JoiInstance.number().required().messages({
                'number.base': customErrorMessages.mustBeNumber,
                'any.required': customErrorMessages.required,
            }),
        }),
    };
}
