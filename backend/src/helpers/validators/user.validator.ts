import { JoiInstance, customErrorMessages } from "./joi"
export default class UserValidator {
    static register = {
        body: JoiInstance.object().keys({
            firstName: JoiInstance.string().min(3).max(50).regex(/^[a-zA-Z]+$/)
                .required().messages({
                    'string.min': customErrorMessages.firstNameMin,
                    'string.max': customErrorMessages.lastNameMax,
                    'string.pattern.base':customErrorMessages.onlyAlphabet,
                    'any.required': customErrorMessages.required,
                }),
            lastName: JoiInstance.string().min(3).max(50).regex(/^[a-zA-Z]+$/)
                .required().messages({
                    'string.min': customErrorMessages.lastNameMin,
                    'string.max': customErrorMessages.lastNameMax,
                    'string.pattern.base':customErrorMessages.onlyAlphabet,
                    'any.required': customErrorMessages.required,
                }),  
            email: JoiInstance.string().email().custom((value, helpers) => {
                const allowedTlds = ['com', 'in', 'gov', 'edu', 'org'];
                const [, tld] = value.split('.');
                if (!allowedTlds.includes(tld)) {
                    return helpers.error('string.email.allowedTlds');
                }
                return value;
            }).required().messages({
                'string.email': customErrorMessages.email,
                'any.required': customErrorMessages.required,
                'string.email.allowedTlds': customErrorMessages.emailAllowedTlds,
            }),
            password: JoiInstance.string().min(6).max(128)
                .required().messages({
                    'string.min': customErrorMessages.stringMin,
                    'string.max': customErrorMessages.stringMax,
                    'any.required': customErrorMessages.required,
                }),
                //TODO change it if required
            // confirmPassword: JoiInstance.string().valid(JoiInstance.ref('password')).required()
            //     .messages({
            //         'any.only': customErrorMessages.confirmPassword,
            //         'any.required': customErrorMessages.required,
            //     }),
            // acceptTerms: JoiInstance.boolean().custom((value, helpers) => {
            //     if(!value) {
            // return helpers.error('any.only');
            // }}).required().messages({
            //         'any.only': customErrorMessages.acceptTerms,
            //         'any.required': customErrorMessages.required,
            //     }),
            //     is_verified: JoiInstance.boolean().messages({
            //             'any.only': customErrorMessages.required,
            //             // 'any.required': customErrorMessages.required,
            //         }),
            phoneNumber: JoiInstance.string().pattern(new RegExp('^[0-9]{10}$')).messages({
                'string.min': customErrorMessages.phoneNumberMin,
                'string.max': customErrorMessages.phoneNumberMax,
                'string.pattern.base': customErrorMessages.phoneNumberInvalid,
                'any.required': customErrorMessages.required,
            }),
        })
    };


    static login = {
        body: JoiInstance.object().keys({
            email: JoiInstance.string().email().custom((value, helpers) => {
                const allowedTlds = ['com', 'in', 'gov', 'edu', 'org'];
                const [, tld] = value.split('.');
                if (!allowedTlds.includes(tld)) {
                    return helpers.error('string.email.allowedTlds');
                }
                return value;
            }).required().messages({
                'string.email': customErrorMessages.email,
                'phoneNumberOrEmail.required': customErrorMessages.required,
                'string.email.allowedTlds': customErrorMessages.emailAllowedTlds,
            }),
            password: JoiInstance.string().required().messages({
                'any.required': customErrorMessages.required,
            }),
        })
    }

    static forgotPassword = {
        body: JoiInstance.object().keys({
            token: JoiInstance.string().required().messages({
                'any.required': customErrorMessages.required,
            }),
            password: JoiInstance.string().required().messages({
                'any.required': customErrorMessages.required,
            }),
        },)
    };

    static changePassword = {
        body: JoiInstance.object({
            oldPassword: JoiInstance.string().required().messages({
                'any.required': customErrorMessages.required,
            }),
            password: JoiInstance.string().min(6).max(128).required().messages({
                'string.min': customErrorMessages.stringMin,
                'string.max': customErrorMessages.stringMax,
                'any.required': customErrorMessages.required,
            }),
        },
        )
    };

}