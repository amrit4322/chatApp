import Joi from "joi";

export const customErrorMessages = {
    email: 'The email must be a valid email address',
    required: '{#label} field is required',
    firstNameMin: 'Firstname must be at least {#limit} characters long',
    lastNameMin: 'lastname must be at least {#limit} characters long',
    phoneNumberMin: 'PhoneNumber must be at least {#limit} digits long',
    lastNameMax: 'Firstname cannot {#limit} characters long',
    firstNameMax: 'Firstname cannot {#limit} characters long',
    phoneNumberMax: 'phoneNumber cannot {#limit} characters long',
    confirmPassword :"confirm Password must be same as password",
    acceptTerms :"Please accept Terms",
    stringMin: 'Password must be at least {#limit} characters long',
    stringMax: 'Password cannot exceed {#limit} characters',
    onlyAlphabet : "Only Alphabets are allowed",
    mustBeNumber : '{#label} must be a number',
    emailAllowedTlds : '{#labe} email address must have valid top level domain',
    phoneNumberInvalid : '{#label} must be a number and must be of 10 digits',
    mustBeString : '{#label} must be a string',
    max12Digits: '{#label} Value must have at most 12 digits, including up to 2 decimal places',
};

export const JoiInstance = Joi.defaults(schema => {
    return schema.options({
        errors: {
            wrap: {
                // Remove quotes from variable names in error messages
                label: false
            }
        }
    });
});